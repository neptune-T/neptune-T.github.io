---
title: 'From RNN to Mamba: The Mathematical Evolution of Sequence Modeling'
date: '2026-04'
summary: 'A mathematical walkthrough of sequence modeling, tracing the evolution from recurrent neural networks and LSTM gating mechanisms to self-attention, FlashAttention, KV-cache optimization, RoPE, state space models, Mamba, RWKV, and hybrid long-context architectures.'
tags: ['sequence-modeling', 'attention']
---


# RNN and LSTM

要理解循环网络的起源，我们需要追溯到多层感知机（MLP）时代。传统的多层感知机只能建立从固定维度输入到固定维度输出的静态空间映射，其基本假设是所有样本独立同分布。但当我们面对自然语言、语音等随时间演化的序列数据时，静态网络显得无能无力。为了引入时间维度，学术界借鉴了非线性动力学系统中的“状态变量”概念。在动力学系统中，系统当前的输出不仅取决于当前的外部激励，还取决于系统内部的状态，而内部状态是对过去所有历史的概括。

基于这一思想，Jeffrey Elman在1990年提出了简单循环网络。从数学上讲，这要求系统状态的演化遵循一个递归的动力学映射。

假设序列在 $t$ 时刻的输入为 $x_t$，系统隐藏状态为 $h_t$，我们需要构造一个函数 $h_t = f(h_{t-1}, x_t; \theta)$。为了使其具备通用逼近能力，并且能够通过反向传播算法计算梯度，研究者们最直接的做法是采用一个线性仿射变换加上一个单调可导的非线性激活函数。这就自然而然地推导出了经典RNN的演化方程

$$
\begin{equation}
    h_t = \tanh(W_{hh} h_{t-1} + W_{xh} x_t + b_h)
\end{equation}
$$

通过将时间轴依序展开，RNN在空间上实际上等效于一个深度为序列长度 $T$ 的前馈神经网络，网络层与层之间共享了权重矩阵。

但这种朴素的动力学建模立刻遭遇了优化的死局。因为当序列长度 $T$ 逐渐增大时，误差梯度基于随时间反向传播（BPTT），在时间步 $k$ 对隐状态的偏导可展开为连续多个时间步状态转移的雅可比矩阵连乘：

$$
\begin{equation}
    \frac{\partial L_t}{\partial h_k} = \frac{\partial L_t}{\partial h_t} \prod_{j=k+1}^t \frac{\partial h_j}{\partial h_{j-1}}
\end{equation}
$$

其中单步雅可比矩阵为 $\frac{\partial h_j}{\partial h_{j-1}} = W_{hh}^T \text{diag}(\sigma'(z_{j-1}))$。对其取矩阵范数，根据次乘法性可得放缩边界：

$$
\begin{equation}
    \left\| \frac{\partial h_t}{\partial h_k} \right\| \le \prod_{j=k+1}^t \left\| W_{hh} \right\| \left\| \text{diag}(\sigma') \right\|
\end{equation}
$$

由于 $\tanh$ 激活函数的导数被严格限制在 $(0, 1]$ 之间，即 $\left\| \text{diag}(\sigma') \right\| \le 1$，且网络为了稳定收敛，初始化的权重矩阵 $W_{hh}$ 的谱半径 $\gamma$ 通常小于1。这就导致了极限状态下 $\lim_{t-k \to \infty} \gamma^{t-k} \to 0$。微小的误差信号在连乘过程中不可避免地呈指数级坍缩趋向于零，这就是RNN无法跨越长期时间步建立相关性的数学死穴。

这种绝境促使了Sepp Hochreiter和Jürgen Schmidhuber在1997年进行了一次理论上的彻底重构，也就是LSTM的诞生。LSTM的推导并非工程上的凭空拼凑，而是基于对“恒定误差流”的严格数学逆推。为了保证误差 $\delta$ 在时间反向传播时既不衰减也不爆炸，他们提出了一个最直白但却切中要害的数学约束条件：在局部状态的时间转移中，其导数必须严格等于1，即 $\frac{\partial f(x)}{\partial x} = 1$。根据微积分基本常识，满足这一偏微分方程约束的最简单函数正是线性恒等函数 $f(x) = x$。

基于这个核心推论，他们设计了一个被称为“常数误差轮播”（Constant Error Carousel，简称CEC）的线性记忆单元。假设这个中心细胞状态为 $C_t$，其基础的动力学演化被设定为绝对的线性累加 

$$
C_t = C_{t-1} + \text{input}_t
$$

由于这里没有任何非线性压缩函数的阻挠，反向传播时连续时间步的梯度回传变为纯粹的常数连乘：

$$
\begin{equation}
    \frac{\partial C_t}{\partial C_k} = \prod_{j=k+1}^t \frac{\partial C_j}{\partial C_{j-1}} = \prod_{j=k+1}^t 1 = 1
\end{equation}
$$

从而在数学根基上直接消灭了梯度消失的可能。

然而，将未经保护的线性单元直接暴露在网络中会带来致命的“权重更新冲突”。如果CEC始终对当前时间步的所有输入开放，那么任何短期的、无关的局部噪声都会被直接无条件累加到 $C_t$ 中，从而破坏并淹没已经存储在其中的长期关键特征；同理，如果CEC的线性记忆始终直接连接到隐层输出端，它也会在无需提取长期记忆的时间步产生冗余信号，干扰当前的预测。为了保护这段极其脆弱的线性记忆，LSTM创造性地引入了门控机制（Gating）。

门控的本质是一个值域被逼近到 $(0,1)$ 区间的可微分调节阀，由Sigmoid函数 $\sigma(x) = \frac{1}{1 + e^{-x}}$ 实现，其目的是实现软性的特征寻址与屏蔽。为了控制当前时刻的候选记忆 $\tilde{C}_t = \tanh(W_c x_t + U_c h_{t-1} + b_c)$ 中到底有多少比例可以被准许写入CEC，推导出了输入门 $i_t = \sigma(W_i x_t + U_i h_{t-1} + b_i)$。此时，CEC的更新方程就演化成了

$$
\begin{equation}
C_t = C_{t-1} + i_t \odot \tilde{C}_t
\end{equation}
$$

同样地，为了控制CEC在当前时刻是否被释放参与构建隐藏层状态输出，推导出了输出门 $o_t = \sigma(W_o x_t + U_o h_{t-1} + b_o)$，使得实际传递给下游的隐藏状态变为 $h_t = o_t \odot \tanh(C_t)$。

到了这一步，Hochreiter提出的初版LSTM已经可以完美解决长距离梯度传播，但在随后的实践中遇到了新问题：在处理持续不断的无限数据流时，如果缺乏衰减机制，细胞状态的范数将发散：

$$
\begin{equation}
    \lim_{t \to \infty} \| C_t \| = \lim_{t \to \infty} \left\| \sum_{\tau=1}^t i_\tau \odot \tilde{C}_\tau \right\| \to \infty
\end{equation}
$$

其内部状态的绝对值会逐渐趋于无穷大，导致网络完全饱和崩溃。因此，在2000年，Felix Gers补齐了LSTM数理推导的最后一块拼图：添加了遗忘门 $f_t = \sigma(W_f x_t + U_f h_{t-1} + b_f)$ 赋予了动力学系统主动切断并重置恒定误差流的能力。通过将原始线性累加方程中的 $C_{t-1}$ 替换为受控衰减的 $f_t \odot C_{t-1}$，我们就得到了现代LSTM最终且严密的细胞状态更新微分方程 

$$
\begin{equation}
    C_t = f_t \odot C_{t-1} + i_t \odot \tilde{C}_t
\end{equation}
$$

此时反向传播的单步雅可比矩阵变为主对角线由 $f_t$ 主导的矩阵：

$$
\begin{equation}
    \frac{\partial C_t}{\partial C_{t-1}} = \text{diag}(f_t) + \frac{\partial f_t}{\partial C_{t-1}} \odot C_{t-1} + \frac{\partial i_t}{\partial C_{t-1}} \odot \tilde{C}_t + i_t \odot \frac{\partial \tilde{C}_t}{\partial C_{t-1}}
\end{equation}
$$

当网络学会保持记忆（即 $f_t \to 1$）时，主导项 $\text{diag}(f_t) \approx I$，在规避了状态空间溢出的同时，完美维持了误差的稳定回传。

# Attention

在自回归序列建模中，全局自注意力（Global Self-Attention）本质上是在高维空间中计算离散测度上的期望。给定输入序列特征矩阵 $X \in \mathbb{R}^{N \times d}$（其中 $N$ 为序列长度，$d$ 为特征维度），我们首先通过三个可学习的线性映射矩阵 $W_Q, W_K \in \mathbb{R}^{d \times d_k}$ 以及 $W_V \in \mathbb{R}^{d \times d_v}$，在仿射空间中投影出查询矩阵 $Q = X W_Q$、键矩阵 $K = X W_K$ 和值矩阵 $V = X W_V$。为了衡量序列中第 $i$ 个词元对第 $j$ 个词元的相关性，最朴素的代数形式是计算其内积 $s_{ij} = q_i k_j^T$。

然而，朴素内积在优化动力学上存在极其致命的方差膨胀问题。我们在概率空间中对此进行严密推导：假设 $q_i$ 与 $k_j$ 的各个分量 $q_{im}$ 和 $k_{jm}$ 均为独立同分布的随机变量，且满足期望 $\mathbb{E}[q_{im}] = \mathbb{E}[k_{jm}] = 0$，方差 $\text{Var}(q_{im}) = \text{Var}(k_{jm}) = 1$。根据独立变量乘积的方差公式，单个分量乘积的方差为：

$$
\begin{equation}
    \text{Var}(q_{im} k_{jm}) = \mathbb{E}[q_{im}^2 k_{jm}^2] - (\mathbb{E}[q_{im} k_{jm}])^2 = \mathbb{E}[q_{im}^2]\mathbb{E}[k_{jm}^2] - 0 = 1 \times 1 = 1
\end{equation}
$$


由于内积 $q_i k_j^T = \sum_{m=1}^{d_k} q_{im} k_{jm}$ 是 $d_k$ 个独立随机变量的和，根据方差的可加性，内积的总体方差将被线性放大至：


$$
\begin{equation}
    \text{Var}(q_i k_j^T) = \sum_{m=1}^{d_k} \text{Var}(q_{im} k_{jm}) = d_k
\end{equation}
$$

这种方差数量级的膨胀，在经过 Softmax 概率归一化时会引发灾难性的雅可比矩阵（Jacobian Matrix）坍缩。 

设 Softmax 的输入向量为 $z$，输出概率分布为 $p$，其偏导数为 $\frac{\partial p_i}{\partial z_j} = p_i (\delta_{ij} - p_j)$，其中 $\delta_{ij}$ 为克罗内克函数。当 $d_k$ 较大时，方差 $d_k$ 会使得部分 $z_i$ 的绝对值极大，导致对应的概率 $p_i \to 1$ 而其他 $p_j \to 0$。此时雅可比矩阵的所有对角线元素趋向于极限：


$$
\begin{equation}
    \lim_{p_i \to 1} p_i (1 - p_i) = 0
\end{equation}
$$

为了在微积分层面上抹除这一梯度消失的奇点，必须将方差强行约束回标准状态。因此，我们引入缩放因子 $\frac{1}{\sqrt{d_k}}$，确立了严格缩放点积注意力的数学期望表达：

$$
\begin{equation}
O = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
\end{equation}
$$

在生成式预训练中，为了维持时间序列的因果联合概率分布分解 $P(x_1, \dots, x_N) = \prod_{i=1}^N P(x_i | x_{<i})$，系统的动力学演化要求任意时间步 $i$ 绝对不能获取 $j > i$ 的未来状态。

为了在高度并行的张量运算中无缝嵌入该约束，我们构造了 **因果掩码（Causal Mask）** 矩阵 $M \in \mathbb{R}^{N \times N}$，其分段定义为：当 $i \ge j$ 时 $M_{ij} = 0$，当 $i < j$ 时 $M_{ij} = -\infty$。掩码操作的极限推导彻底阻断了非因果权重的反向传播：

$$
\begin{equation}
    \lim_{M_{ij} \to -\infty} \exp\left(\frac{q_i k_j^T}{\sqrt{d_k}} + M_{ij}\right) = 0
\end{equation}
$$

尽管上述矩阵方程在代数上极具优雅性，但显式计算 $QK^T$ 相似度矩阵的时空复杂度严格遵循二次方曲线 $\mathcal{O}(N^2)$。

为了打破这一理论枷锁，**稀疏注意力（Sparse Attention）** 提出通过约束期望的支撑集 $\mathcal{S}_i \subset \{1, 2, \dots, N\}$（如设定带状对角矩阵条件 $|j - i| \le w$），将复杂度强行化归至 $\mathcal{O}(N w)$。

但要在保留全局感受野的前提下彻底消灭 $\mathcal{O}(N^2)$，我们需要引入 **线性注意力（Linear Attention）** 与 **核近似（Kernel Approximation）**。

由于 Softmax 函数的非线性指数映射严格阻断了张量乘法的结合律，我们根据 Mercer 定理将原核函数 $K(q_i, k_j) = \exp(q_i k_j^T / \sqrt{d_k})$ 近似分解为显式特征映射的外积形式 $K(q_i, k_j) \approx \phi(q_i)^T \phi(k_j)$，其中特征映射 $\phi(\cdot): \mathbb{R}^{d_k} \to \mathbb{R}^{c}$。此时，第 $i$ 个词元的输出期望算式发生如下重构：

$$
\begin{equation}
    O_i = \frac{\sum_{j=1}^N \phi(q_i)^T \phi(k_j) v_j^T}{\sum_{j=1}^N \phi(q_i)^T \phi(k_j)}
\end{equation}
$$

这里迎来了架构演进中最具决定性的代数降维：因为特征向量 $\phi(q_i)^T \in \mathbb{R}^{1 \times c}$ 仅依赖于外层查询索引 $i$，与内部求和变量 $j$ 绝对正交独立。利用矩阵乘法的结合律，我们能够将 $\phi(q_i)^T$ 强行提取至求和符号之外：

$$
\begin{equation}
    O_i = \frac{\phi(q_i)^T \left( \sum_{j=1}^N \phi(k_j) v_j^T \right)}{\phi(q_i)^T \left( \sum_{j=1}^N \phi(k_j) \right)}
\end{equation}
$$

在这个化归后的等式中，分子内部的求和项 $\sum_{j=1}^N \phi(k_j) v_j^T$ 构成了一个维度为 $\mathbb{R}^{c \times d_v}$ 的固定全局协方差矩阵，而分母的求和项 $\sum_{j=1}^N \phi(k_j)$ 构成了一个 $\mathbb{R}^c$ 的全局上下文向量。这两者对于任意查询 $q_i$ 而言均为全局不变量。因此，模型只需对 $K$ 和 $V$ 进行一次前向线性扫描累加，再与局部 $Q$ 进行低阶矩阵乘法，便在保持数学等价（近似）的前提下，将自注意力的复杂度严谨地从 $\mathcal{O}(N^2)$ 塌缩至 $\mathcal{O}(N \cdot c \cdot d_v)$。这就是现代所有长文本混合架构能够实现近乎无限上下文窗口的核心数学基石。



我的失误。上一版确实遗漏了章节的结构标示，并且将数学公式过多地揉捏在长句之中，削弱了推导的纯粹性与张力。作为架构师，我应当用最严密的代数递推来展现这些技术的内核。

我们直接进入下一章，严格恢复学术推演的排版，用纯粹的微积分和张量分析为你解构这三大工程与算力优化技术的底层逻辑。

# Industry


标准全局注意力在计算期望 $O = \text{softmax}(QK^T)V$ 时，必须在 GPU 的高带宽显存（HBM）中显式实例化并读写庞大的 $N \times N$ 注意力分数矩阵。这种 $\mathcal{O}(N^2)$ 的内存访问复杂度（Memory Access Complexity）严重拖垮了浮点运算（FLOPs）。

FlashAttention 的数学本质是利用分块（Tiling）算法，将全局的 Softmax 期望求解转化为在静态随机存储器（SRAM）内的局部马尔可夫状态更新。对于输入向量 $x \in \mathbb{R}^N$，标准 Softmax 的计算需要两遍扫描：

$$
\begin{equation}
    m = \max_{1 \le i \le N} x_i
\end{equation}
$$


$$
\begin{equation}
    l = \sum_{1 \le i \le N} \exp(x_i - m)
\end{equation}
$$


$$
\begin{equation}
    p_i = \frac{\exp(x_i - m)}{l}
\end{equation}
$$



FlashAttention 引入了在线统计量（Online Statistics）的递推方程。假设我们将向量 $x$ 截断为两个子块 $x^{(1)}$ 和 $x^{(2)}$，并在 SRAM 中计算局部的极值与配分函数：

$$
\begin{equation}
    m^{(1)} = \max(x^{(1)}), \quad l^{(1)} = \sum \exp(x^{(1)} - m^{(1)})
\end{equation}
$$


$$
\begin{equation}
    m^{(2)} = \max(x^{(2)}), \quad l^{(2)} = \sum \exp(x^{(2)} - m^{(2)})
\end{equation}
$$


当我们要将局部统计量合并为全局统计量时，全局最大值显然是 $m = \max(m^{(1)}, m^{(2)})$。此时，最精妙的代数重构出现了——全局配分函数 $l$ 可以通过乘以指数衰减因子进行无损的增量更新：

$$
\begin{equation}
    l = \exp(m^{(1)} - m) l^{(1)} + \exp(m^{(2)} - m) l^{(2)}
\end{equation}
$$

基于此，对应于这两个子块的最终输出张量 $O^{(1)}$ 和 $O^{(2)}$ 的局部期望，可以通过下式进行全局重缩放（Rescaling）：

$$
\begin{equation}
    O = \frac{\exp(m^{(1)} - m) l^{(1)} O^{(1)} + \exp(m^{(2)} - m) l^{(2)} O^{(2)}}{l}
\end{equation}
$$

这套严密的递推代数方程，使得模型在计算 $QK^T$ 时，可以分块将其载入极速但容量极小的 SRAM 中。通过在片上直接完成局部乘加与状态重缩放，彻底消灭了 $N \times N$ 矩阵在 HBM 中的显式读写。其数学证明不仅将显存占用从 $\mathcal{O}(N^2)$ 塌缩至 $\mathcal{O}(N)$，更通过减少 IO 瓶颈，实现了数倍的物理加速。



在自回归解码（Decoding）阶段，模型每生成一个新的词元，都需要将历史所有词元的键（Key）和值（Value）张量提取出来与当前的查询（Query）计算内积。为了避免冗余计算，工程上引入了 **KV Cache 机制**。

在标准的多头注意力（MHA）中，假设序列长度为 $N$，隐藏层总维度为 $d$，注意力头数为 $H$，每个头的维度为 $d_h = d/H$。对于每一层，KV Cache 需要在显存中驻留的张量规模为：

$$
\begin{equation}
    \text{Memory}_{\text{MHA}} = 2 \times N \times H \times d_h = 2Nd
\end{equation}
$$

当 $N$ 趋向于极大值时（如数万词元的上下文），这 $2Nd$ 的显存占用和极高的读取带宽需求成为了推理速度的物理死穴。多查询注意力（MQA）通过强制张量空间在多头之间的退化，给出了极致的压缩方案。在 MQA 中，所有的 $H$ 个 Query 头强制共享同一组 Key 和 Value 投影：

$$
\begin{equation}
    Q \in \mathbb{R}^{H \times d_h}, \quad K \in \mathbb{R}^{1 \times d_h}, \quad V \in \mathbb{R}^{1 \times d_h}
\end{equation}
$$


此时 KV Cache 的驻留规模被除以了 $H$：

$$
\begin{equation}
    \text{Memory}_{\text{MQA}} = 2 \times N \times 1 \times d_h = \frac{2Nd}{H}
\end{equation}
$$

虽然 MQA 逼近了内存带宽的理论极限，但过度的张量秩亏损（Rank Deficiency）导致了表征能力的坍缩。因此，分组查询注意力（GQA）作为代数插值解被提出。假设我们将 $H$ 个头划分为 $G$ 个组，每个组内的 $H/G$ 个 Query 共享一组 KV：

$$
\begin{equation}
    \text{Memory}_{\text{GQA}} = 2 \times N \times G \times d_h = \frac{2Nd \cdot G}{H}
\end{equation}
$$

通过控制超参数 $G$ 的大小，GQA 在数学期望上维持了接近 MHA 的非线性表征空间，同时在物理带宽上逼近了 MQA 的读取效率。


在 Transformer 中，由于自注意力算子 $O = \text{softmax}(QK^T)V$ 是完全置换对称（Permutation Equivariant）的，如果不显式注入位置信息，序列将退化为无序的词袋集合。 **旋转位置编码（RoPE）** 的核心思想是：用绝对位置编码的简单计算形式，在代数上实现相对位置的内积响应。

设第 $m$ 个位置的输入特征为 $x_m$，我们希望构造一个编码映射函数 $f(\cdot, m)$，使得两个经过编码的 Query 和 Key 的内积，仅受它们相对距离 $(m-n)$ 的约束：

$$
\begin{equation}
    \langle f_q(x_m, m), f_k(x_n, n) \rangle = g(x_m, x_n, m-n)
\end{equation}
$$

RoPE 将这一泛函方程的解集映射到了复数域 $\mathbb{C}$。假设输入特征为二维向量 $[q_1, q_2]$，将其表示为复平面上的向量 $q = q_1 + i q_2 = |q| e^{i\alpha}$。RoPE 证明，满足上述条件的最优映射是对复向量赋予一个随位置 $m$ 线性增长的旋转角 $m\theta$：

$$
\begin{equation}
    f_q(x_m, m) = q e^{i m \theta}
\end{equation}

$$

$$
\begin{equation}
    f_k(x_n, n) = k e^{i n \theta}
\end{equation}

$$

在复数空间中计算二者的共轭内积的实部，根据欧拉公式与复数乘法法则：

$$
\begin{equation}
    \langle f_q, f_k \rangle = \text{Re} \left[ (q e^{i m \theta}) (k e^{i n \theta})^* \right] = \text{Re} \left[ q k^* e^{i (m-n) \theta} \right]
\end{equation}
$$

这就完成了最核心的数学闭环：内积公式中完美分离出了仅依赖于 $m-n$ 的旋转相位 $e^{i (m-n) \theta}$。

将其推广到高维实数空间 $\mathbb{R}^d$，该复数乘法等价于在特征向量上乘以一个分块对角正交旋转矩阵 $R_{\Theta, m}$：

$$
\begin{equation}
    R_{\Theta, m} = \begin{pmatrix} \cos m\theta_1 & -\sin m\theta_1 & \dots & 0 & 0 \\ \sin m\theta_1 & \cos m\theta_1 & \dots & 0 & 0 \\ \vdots & \vdots & \ddots & \vdots & \vdots \\ 0 & 0 & \dots & \cos m\theta_{d/2} & -\sin m\theta_{d/2} \\ 0 & 0 & \dots & \sin m\theta_{d/2} & \cos m\theta_{d/2} \end{pmatrix}
\end{equation}
$$

利用正交矩阵的性质 $R^T = R^{-1}$，其内积的张量表达式为：

$$
\begin{equation}
    (R_{\Theta, m} q)^T (R_{\Theta, n} k) = q^T R_{\Theta, m}^T R_{\Theta, n} k = q^T R_{\Theta, n-m} k
\end{equation}

$$

这一套极具对称美感的纯粹代数推导，使得现代大语言模型无需在计算图中维护任何庞大的相对位置偏置矩阵，仅通过前向传递中的一次坐标系旋转，便赋予了注意力机制完美的外推（Extrapolation）潜力与相对距离感知能力。

# 

当语言模型的上下文需求突破百万词元大关时，Transformer 架构中自注意力算子基于张量内积的 KV Cache 显存占用与时间复杂度成为了难以逾越的物理奇点。


**状态空间模型（SSM）** 的数学根基并不源自传统的自然语言处理，而是现代连续控制理论。其核心理论是将序列建模为一个连续时间流形上的隐状态演化过程。对于一维输入信号 $x(t) \in \mathbb{R}$，其高维隐状态 $h(t) \in \mathbb{R}^N$ 与系统输出 $y(t) \in \mathbb{R}$ 遵循严格的线性常微分方程（ODE）：

$$
\begin{equation}
    h'(t) = A h(t) + B x(t)
\end{equation}
$$

$$
\begin{equation}
    y(t) = C h(t) + D x(t)
\end{equation}
$$

为了在图灵架构的数字硬件上处理离散的词元序列，必须对上述连续微分方程进行积分与离散化。引入时间步长参数 $\Delta$，利用零阶保持（Zero-Order Hold, ZOH）假设在采样区间内输入恒定，我们通过泰勒级数与矩阵指数推导出离散的马尔可夫状态演化方程：

$$
\begin{equation}
    \bar{A} = \exp(\Delta A)
\end{equation}

$$

$$
\begin{equation}
    \bar{B} = (\Delta A)^{-1} (\exp(\Delta A) - I) \cdot \Delta B
\end{equation}
$$

此时，连续系统的动力学积分被精确等价为时间步 $t$ 上的代数递推：
$$
\begin{equation}
   h_t = \bar{A} h_{t-1} + \bar{B} x_t 
\end{equation}
$$

这种推导存在一个极其优美的代数特性。由于 $\bar{A}$ 和 $\bar{B}$ 是与时间无关的全局恒定矩阵（构成线性时不变系统，LTI），该递推方程在时间轴上展开后，完全等价于对整个输入序列进行一次非自回归的一维卷积。设全局卷积核为 $\bar{K} = (C\bar{B}, C\bar{A}\bar{B}, \dots, C\bar{A}^L \bar{B})$，则前向输出 $y = x * \bar{K}$。这意味着模型可以利用快速傅里叶变换（FFT）根据卷积定理将时域卷积转化为频域乘法，在 $\mathcal{O}(L \log L)$ 的复杂度下完成极速的并行训练，从而在数学上完美缝合了 RNN 的常数级推理内存与 Transformer 的并行训练优势。



尽管 LTI 属性赋予了标准 SSM 极高的并行效率，但它也带来了致命的代数缺陷：系统演化矩阵恒定不变，导致模型相当于在用同一个静态线性滤波器处理所有上下文，彻底丧失了根据输入数据特征进行“选择性记忆或遗忘”的非线性推理能力。

**Mamba** 架构的数理突破在于强行粉碎了 LTI 约束，引入了基于流形的输入依赖非线性门控（Selective Mechanism）。它将微分方程的关键投影矩阵映射为当前输入张量 $x_t$ 的显式函数：

$$
\begin{equation}
    B_t = W_B x_t
\end{equation}
$$


$$
\begin{equation}
    C_t = W_C x_t
\end{equation}
$$


$$
\begin{equation}
    \Delta_t = \text{softplus}(\text{parameter} + W_{\Delta} x_t)
\end{equation}
$$

当上述算子代入离散化方程后，状态转移矩阵 $\bar{A}_t$ 和 $\bar{B}_t$ 瞬间坍缩为时变张量（Time-Varying Tensors）。这导致全局卷积等式 $\bar{K}$ 在代数上不再成立，FFT 并行化失效。为了在无法使用卷积域映射的前提下维持训练效率，Mamba 在 GPU 硬件底层重构了前缀和（Prefix Sum）的并行扫描（Parallel Scan）算法。通过在极速的片上 SRAM 中直接完成非线性状态树的归约展开，Mamba 在维持推导严密性的同时，实现了硬件感知的 $\mathcal{O}(N)$ 线性训练速度与纯粹的 $\mathcal{O}(1)$ 序列推理复杂度。



在平行的学术分支上，**RWKV** 和 **门控线性注意力（GLA）** 揭示了核近似注意力与时变 RNN 之间深刻的代数同态性。RWKV 的本质是将自注意力算子中的绝对位置映射剥离，替换为严格服从指数衰减的时间惩罚因子 $w$。第 $t$ 步输出状态 $O_t$ 的期望方程被重构为：

$$
\begin{equation}
O_t = \frac{\sum_{i=1}^t \exp(-(t-i)w) k_i v_i}{\sum_{i=1}^t \exp(-(t-i)w) k_i}
\end{equation}
$$

这段非参数估计的期望公式，可以通过定义分子张量 $N_t$ 和分母向量 $D_t$，严格化归为一组马尔可夫递推方程：

$$
\begin{equation}
    N_t = \exp(-w) N_{t-1} + k_t v_t
\end{equation}
$$


$$
\begin{equation}
    D_t = \exp(-w) D_{t-1} + k_t
\end{equation}
$$


$$
\begin{equation}
    O_t = \frac{N_t}{D_t}
\end{equation}
$$

这段推导证明了，只要将全局 Softmax 相似度度量替换为马尔可夫指数衰减核，二次方的注意力期望就可以无损地坍缩为两个隐状态变量的常量递推。而 GLA（Gated Linear Attention）则更进一步，将这个标量衰减因子 $w$ 升级为由输入动态生成的高维数据门控矩阵（类似于 LSTM 的遗忘门），从而在数学架构上彻底打通了 RNN 的门控动力学与 Transformer 线性特征投影的理论壁垒。



在探索序列建模的物理极限时，学术界发现注意力机制由于在张量空间内显式保留了所有历史词元的高维内积 $QK^T$，在处理高频局部语义的精准寻址（如上下文少样本学习与代码逻辑追溯）上具有不可替代的解析优势；而 SSM 则在长程状态压缩与显存控制上逼近了理论最优解。

Jamba 架构给出了现阶段最优雅的宏观拓扑折中。它在网络图中将 Transformer 的自注意力层与 Mamba 的时变状态层进行特定比例的交替堆叠，并融合了 MoE 的稀疏激活算子。当特征流形穿过网络时，注意力的协方差算子负责进行密集、高分辨率的语义特征对齐，而 SSM 的线性时变演化算子 $\bar{A}_t h_{t-1}$ 则负责将深层的庞大上下文进行不可逆的马尔可夫压缩。这种混合动力学系统在严密的数学图景下，既保留了注意力空间非线性逼近的绝对锐度，又利用状态空间的常数级推理特性，成功将语言模型的无损处理边界推向了数百万词元的极境。
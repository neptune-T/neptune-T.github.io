---
title: 'Hamiltonian, Action, and Path Integral'
date: '2026-07'
summary: 'Classical mechanics can be organized around force, action, or energy. The Hamiltonian—energy on phase space—turns out to be the object that survives into quantum theory as the generator of time evolution on Hilbert space, while the action reappears as the phase weighting every path in the path integral. Following these two threads, together with the Poisson-bracket-to-commutator correspondence and the symmetry–conservation link, leads through quantization, the harmonic oscillator, statistical mechanics, quantum field theory, renormalization, and effective field theory.'
tags: ['Physics','Quantum Mechanics']
---

> “The electron does anything it likes.” — Richard Feynman


![](https://raw.githubusercontent.com/neptune-t/aca-web-html/main/public/img/hamiltonians/hamiltonians.png)

经典力学有三种彼此等价的表述：牛顿以力为核心，拉格朗日以作用量为核心，哈密顿以能量和相空间为核心。它们在经典层面给出相同的轨迹，但通向量子力学的路却不同。哈密顿量最终成为希尔伯特空间上时间演化的生成元，作用量则成为路径积分里每条路径的相位权重，而经典的泊松括号在量子化里变成算符对易子。这篇笔记沿着这几条线，从牛顿方程一直走到量子场论、重整化、有效场论，以及对称性与守恒量的关系，尽量把中间每一步"为什么"讲清楚，而不只是罗列结论。

# 牛顿力学：以力为中心

经典力学最初是围绕力建立的。给定物体当前的位置、速度和所受的力，牛顿第二定律直接给出它下一时刻的运动：

$$
\begin{equation}
F = ma.
\end{equation}
$$

在这套语言里，运动是一个逐时刻更新的过程：力决定加速度，加速度改变速度和位置。这是一个二阶微分方程，需要两组初始条件——初始位置和初始速度——才能确定唯一的解。一旦这两组数据给定，整条轨迹就被完全锁死，过去和未来都能算出来。这就是经典力学的决定论：世界像一台给定初值后严格运行的机器。这一点也解释了为什么后面要用 $(q,\dot q)$ 或 $(q,p)$ 这样成对的变量来描述状态——单有位置不够，还要知道它正往哪走、走多快。

从计算的角度看，牛顿方程和工程里的时间步进仿真几乎是同一件事：知道此刻的力，就能把状态往前推一小步，再算新的力，如此反复。它直观、可操作，对大多数具体问题都够用。

问题出在约束和坐标上。当系统有复杂约束、要用非直角坐标，或多个自由度耦合时，逐个分析所有力会很麻烦，而且很多力我们其实并不关心。单摆是典型例子：摆球受重力和绳的张力，但张力的作用只是把摆球约束在圆弧上，它的大小要根据运动反解出来，本身不携带我们想知道的动力学信息。若在笛卡尔坐标 $(x,y)$ 下直接写牛顿方程，就必须显式引入这个未知的约束力，再加上约束条件 $x^2+y^2=\ell^2$ 联立求解。真正自由的其实只有一个量——摆角 $\theta$。牛顿框架没有提供一种自动"只保留真正自由的自由度"的办法，这正是拉格朗日力学要解决的。

# 拉格朗日力学与作用量

## 广义坐标与约束

拉格朗日力学换了一个出发点。它不先追踪每个力，而是选取一组能独立描述系统位形的变量，叫广义坐标，记作 $q=(q_1,\dots,q_n)$。这里的 $q_i$ 不必是笛卡尔坐标，可以是角度、弧长、相对位移等等，只要它们能唯一地确定系统的位形，并且已经把约束"用掉"。

回到单摆：与其用受约束的 $(x,y)$，不如直接用摆角 $\theta$。约束 $x=\ell\sin\theta$、$y=-\ell\cos\theta$ 已经内建在这个选择里，绳的张力从此不再出现在方程中。系统只剩一个自由度，运动方程也只有一个。用合适的广义坐标把约束提前消化掉，是拉格朗日方法最实用的一点。

## 作用量与变分原理

选好坐标后，用能量构造一个标量函数——拉格朗日量，通常是动能减势能：

$$
\begin{equation}
L(q,\dot q,t)=T(q,\dot q,t)-V(q,t).
\end{equation}
$$

牛顿关心某一瞬间的受力，拉格朗日关心的是整条路径。给定一条从初态到末态的候选轨迹 $q(t)$，把 $L$ 沿时间累加就得到作用量：

$$
\begin{equation}
S[q]=\int_{t_0}^{t_1} L(q,\dot q,t)\,dt.
\end{equation}
$$

注意 $S$ 的自变量是整条函数 $q(t)$，不是某个数——它是一个泛函。真实发生的轨迹并非任意一条，而是使作用量取驻值的那条：

$$
\begin{equation}
\delta S = 0.
\end{equation}
$$

这就是驻定作用量原理（常被叫作最小作用量原理，但严格说是驻值）。它的含义是：对真实路径做一个两端固定、中间任意的微小扰动 $q(t)\to q(t)+\delta q(t)$，作用量的一阶变化为零。把这句话写成公式就能推出运动方程。变分为

$$
\begin{equation}
\delta S=\int_{t_0}^{t_1}\left(\frac{\partial L}{\partial q}\,\delta q+\frac{\partial L}{\partial \dot q}\,\delta\dot q\right)dt.
\end{equation}
$$

对第二项分部积分，利用端点固定 $\delta q(t_0)=\delta q(t_1)=0$ 把边界项去掉，得到

$$
\begin{equation}
\delta S=\int_{t_0}^{t_1}\left(\frac{\partial L}{\partial q}-\frac{d}{dt}\frac{\partial L}{\partial \dot q}\right)\delta q\,dt.
\end{equation}
$$

要让它对任意 $\delta q$ 都为零，括号里必须处处为零，这就是欧拉–拉格朗日方程：

$$
\begin{equation}
\frac{d}{dt}\frac{\partial L}{\partial \dot q}-\frac{\partial L}{\partial q}=0.
\end{equation}
$$

对 $L=\tfrac12 m\dot q^2-V(q)$，它正好还原成 $m\ddot q=-V'(q)$，即牛顿方程。所以拉格朗日力学没有推翻牛顿，只是换了组织方式：不再逐个写力，而是写一个标量 $L$，再对坐标选择不敏感地导出运动。约束、非惯性系、耦合自由度在这套语言里都处理得更干净。

## 为什么路径视角重要

更深的一点是视角的转变。牛顿方程是局部的逐步更新，作用量原理则把运动写成一个整体的路径选择问题：在所有可能路径中，挑出让作用量驻定的那一条。经典系统最终只走一条路径，其余路径只是数学上的候选。但这个"从所有路径里挑一条"的表述，恰好可以在量子力学里被推广成"所有路径共同贡献、按相位叠加"，经典路径则作为一种极限重新浮现。这条线索会在第十二、十三节展开，是路径积分的起点。

# 哈密顿力学与相空间

## 勒让德变换

拉格朗日力学的基本变量仍是位置和速度 $(q,\dot q)$。哈密顿力学再走一步，把速度换成动量。由拉格朗日量定义的广义动量为

$$
\begin{equation}
p = \frac{\partial L}{\partial \dot q}.
\end{equation}
$$

对 $L=\tfrac12 m\dot q^2-V$ 这就是熟悉的 $p=m\dot q$，但对一般 $L$，$p$ 可以是 $\dot q$ 的复杂函数。换变量的手续叫勒让德变换：它把以 $\dot q$ 为自然变量的 $L$，换成以 $p$ 为自然变量的新函数

$$
\begin{equation}
H(q,p,t)=p\dot q - L(q,\dot q,t),
\end{equation}
$$

其中右边要把 $\dot q$ 用 $p$ 反解掉，多自由度时对各分量求和 $\sum_i p_i\dot q_i$。这种变换的关键性质是可逆（只要 $L$ 对 $\dot q$ 是凸的，即 $\partial^2 L/\partial\dot q^2\neq0$），因此哈密顿和拉格朗日两套描述携带完全相同的信息。

对一个质量为 $m$、势能为 $V(q)$ 的粒子，做完变换得到

$$
\begin{equation}
H(q,p)=\frac{p^2}{2m}+V(q),
\end{equation}
$$

第一项是动能，第二项是势能。在这类系统里 $H$ 就是总能量。如果某个坐标不出现在 $L$（也就不出现在 $H$）里，称它为循环坐标，对应的动量守恒——这已经是对称性与守恒量关系的一个雏形。

## 相空间与正则方程

把状态从 $(q,\dot q)$ 改写为 $(q,p)$ 不只是换了个变量。由 $q$ 和 $p$ 张成的空间叫相空间，系统每一时刻对应相空间里的一个点，运动就是这个点画出的一条轨迹。把 $H$ 只理解成"能量"会漏掉它更关键的作用：它生成相空间里的演化。对 $H(q,p,t)=p\dot q-L$ 取全微分并用广义动量的定义与欧拉–拉格朗日方程，可得哈密顿正则方程：

$$
\begin{equation}
\begin{aligned}
\dot q &= \frac{\partial H}{\partial p}, \\
\dot p &= -\frac{\partial H}{\partial q}.
\end{aligned}
\end{equation}
$$

它把一个 $n$ 维的二阶方程组换成了 $2n$ 维的一阶方程组。给定 $H(q,p,t)$ 和相空间里的一个初始点，未来的整条轨迹就唯一确定了。这种一阶、对称的形式在几何上非常干净：相空间里每一点都指定了一个"流速"，整个系统沿这个速度场流动。

## 泊松括号

哈密顿力学还带来一个后面通往量子力学的关键工具：泊松括号。对相空间上的任意两个函数 $A(q,p)$ 和 $B(q,p)$，定义

$$
\begin{equation}
\{A,B\}=\sum_i\left(\frac{\partial A}{\partial q_i}\frac{\partial B}{\partial p_i}-\frac{\partial A}{\partial p_i}\frac{\partial B}{\partial q_i}\right).
\end{equation}
$$

基本坐标之间满足

$$
\begin{equation}
\{q_i,q_j\}=0,\qquad \{p_i,p_j\}=0,\qquad \{q_i,p_j\}=\delta_{ij}.
\end{equation}
$$

任意物理量 $A(q,p,t)$ 沿轨迹的时间变化，可以统一写成

$$
\begin{equation}
\frac{dA}{dt}=\{A,H\}+\frac{\partial A}{\partial t}.
\end{equation}
$$

正则方程本身就是这个式子的特例：$\dot q=\{q,H\}$，$\dot p=\{p,H\}$。泊松括号把"时间演化"抽象成了一个代数运算——$H$ 通过与它取括号来推动一切量演化。它还立刻给出守恒判据：若 $A$ 不显含时间且 $\{A,H\}=0$，则 $A$ 守恒。记住这个 $\{q,p\}=1$ 和 $\dot A=\{A,H\}$，第六节量子化时它们会几乎原样地变成 $[\hat q,\hat p]=i\hbar$ 和海森伯方程。

## 刘维尔定理

正则方程还有一个整体性的推论。考虑相空间里一小团初始条件（一个体积元），让它们各自按哈密顿流演化。刘维尔定理说，这团点占据的相空间体积在演化中保持不变：

$$
\begin{equation}
\frac{d}{dt}\!\int_{\Gamma}dq\,dp=0.
\end{equation}
$$

直观上，哈密顿流是相空间里的"不可压缩流动"，可以把它挤压变形，但不能改变体积。这条性质是统计力学的基石之一：它保证了相空间上的均匀分布在演化下保持均匀，从而支撑等概率假设。哈密顿力学因此不仅描述单条轨迹，也描述"一族状态"如何整体流动——这个"对一族状态求和/积分"的思路，正是后面统计物理和路径积分共同的底色。

# 对称性与守恒量

在离开经典力学之前，还有一个结构值得先讲，因为它贯穿全篇：守恒量来自对称性。能量守恒、动量守恒、角动量守恒看起来是三条独立规则，但它们有共同来源。诺特定理说，作用量的每一个连续对称性都对应一个守恒量：

$$
\begin{equation}
\text{连续对称性}\ \Longrightarrow\ \text{守恒量}.
\end{equation}
$$

## 时间平移与能量

如果拉格朗日量不显含时间，$L(q,\dot q,t)=L(q,\dot q)$，意味着今天和明天做同一个实验、初始条件相同则规律相同。利用欧拉–拉格朗日方程可以证明，此时下面这个量对时间的导数为零：

$$
\begin{equation}
H=\sum_i p_i\dot q_i-L,\qquad \frac{dH}{dt}=0.
\end{equation}
$$

守恒的正是哈密顿量，在常见系统里就是总能量。一旦 $H$ 显含时间（例如受随时间变化的外场驱动），外界可以注入或抽走能量，能量就不再守恒。所以能量守恒真正依赖的是时间平移对称性，而不是一条独立公理。

## 空间平移与动量

若 $L$ 只依赖 $\dot q$ 而不依赖绝对位置 $q$，则 $\partial L/\partial q=0$，欧拉–拉格朗日方程直接给出 $\dot p=0$，即动量守恒。直觉上，如果空间没有哪个位置特殊，系统就没有理由偏向某处。一旦加上外势，例如均匀重力 $V(q)=mgq$，不同高度势能不同，平移对称被破坏，动量便不守恒——重力给出了一个特殊方向。

## 旋转与角动量

中心势 $V(\mathbf r)=V(|\mathbf r|)$ 只依赖到原点的距离，绕原点旋转不改变它，于是角动量 $\mathbf L=\mathbf r\times\mathbf p$ 守恒。行星在近似中心力下运动，角动量守恒把轨道锁在一个固定平面内，并给出开普勒第二定律（等面积速率）。

这把守恒律从经验规律变成了结构性结论：物理规律之所以稳定，是因为它在某些变换下保持不变。量子力学里这套关系依然成立，只是语言会换成算符和对易关系——第二十节会用泊松括号在量子化后的对应把它接回来。

# 量子态与希尔伯特空间

经典力学里，系统的完整状态是相空间中的一个点 $(q,p)$。量子力学的第一个根本改变，是把状态本身换掉了。

## 态矢量与叠加

量子系统的状态不再是一个点，而是一个矢量，记作 $|\psi\rangle$，它属于一个复内积空间——希尔伯特空间 $\mathcal H$。这个空间是线性的：如果 $|\psi_1\rangle$ 和 $|\psi_2\rangle$ 都是合法状态，那么它们的复系数叠加

$$
\begin{equation}
|\psi\rangle=c_1|\psi_1\rangle+c_2|\psi_2\rangle
\end{equation}
$$

也是合法状态。叠加原理是量子力学与经典最直接的分歧，也是干涉现象的根源。要注意叠加发生在复数振幅层面，而不是概率层面——正因为振幅是复数、能相互抵消，才有干涉。

## 内积、对偶与玻恩规则

$\mathcal H$ 上有内积 $\langle\phi|\psi\rangle$，是一个复数，用来定义长度和正交性，满足 $\langle\phi|\psi\rangle=\langle\psi|\phi\rangle^{*}$。每个右矢 $|\psi\rangle$ 对应一个左矢（对偶空间元素）$\langle\psi|$。物理态取归一化 $\langle\psi|\psi\rangle=1$。内积给出玻恩规则：在态 $|\psi\rangle$ 中测量某可观测量、得到本征态 $|n\rangle$ 的概率是

$$
\begin{equation}
P(n)=|\langle n|\psi\rangle|^2.
\end{equation}
$$

$\langle n|\psi\rangle$ 是复数振幅，模平方才是概率。这就是"波函数是概率振幅而非概率本身"的确切含义。

## 表象：位置与动量

态是抽象矢量，要计算得选一组基把它写成分量。位置本征态 $|q\rangle$ 构成一组（连续）基，波函数不过是态在这组基上的分量：

$$
\begin{equation}
\psi(q)=\langle q|\psi\rangle.
\end{equation}
$$

同样可以用动量本征态 $|p\rangle$ 展开，得到动量表象波函数 $\tilde\psi(p)=\langle p|\psi\rangle$。两种表象通过傅里叶变换联系，$\langle q|p\rangle=\tfrac{1}{\sqrt{2\pi\hbar}}e^{ipq/\hbar}$。连续基的正交归一与完备性写成

$$
\begin{equation}
\langle q|q'\rangle=\delta(q-q'),\qquad \int dq\,|q\rangle\langle q| = I.
\end{equation}
$$

后一个式子把恒等算符分解成对所有位置的投影之和，看似平凡，却是推导路径积分的核心工具：它允许我们在演化的任意时刻"插入一整套中间位置"。

## 算符、可观测量与测量

可观测量由作用在 $\mathcal H$ 上的厄米算符表示。厄米性 $\hat A^\dagger=\hat A$ 保证本征值为实数（可以是测量结果），并且本征态构成一组完备正交基，于是任意态都能按它展开，$\hat A=\sum_n a_n|n\rangle\langle n|$（谱分解）。时间演化则由酉算符实现，酉性 $\hat U^\dagger\hat U=I$ 保证概率守恒。测量本身是另一回事：测得结果 $a_n$ 后，态"坍缩"到对应本征态 $|n\rangle$。经典的相空间点由此让位给希尔伯特空间中的态矢量，而经典函数 $H(q,p)$ 将让位给算符 $\hat H$。

# 正则量子化与对易关系

## 从泊松括号到对易子

从经典哈密顿力学过到量子力学，有一个惊人简洁的对应。经典的可观测量是相空间函数，量子的可观测量是算符；连接两者的，是把泊松括号换成对易子：

$$
\begin{equation}
\{A,B\}\ \longrightarrow\ \frac{1}{i\hbar}[\hat A,\hat B].
\end{equation}
$$

把这条规则用到基本变量 $\{q,p\}=1$ 上，立刻得到正则对易关系

$$
\begin{equation}
[\hat q,\hat p]=i\hbar.
\end{equation}
$$

第三节里经典量的演化方程 $\dot A=\{A,H\}$，在同一对应下变成量子的海森伯方程 $\dot{\hat A}=\tfrac{1}{i\hbar}[\hat A,\hat H]$（第七节展开）。也就是说，量子力学不是凭空另起炉灶，它把经典哈密顿结构里的括号运算整体"提升"为算符对易——泊松括号是这套结构的经典影子，$\hbar\to0$ 时对易子除以 $i\hbar$ 就回到泊松括号。

## 对易关系与不确定性

$[\hat q,\hat p]=i\hbar$ 是量子与经典的分水岭。经典的 $q$ 和 $p$ 是可交换的普通数，可以同时取确定值；量子的 $\hat q$ 与 $\hat p$ 不对易，因此无法同时被任意精确地确定。由柯西–施瓦茨不等式，任意两个可观测量满足 $\Delta A\,\Delta B\geq\tfrac12|\langle[\hat A,\hat B]\rangle|$，代入正则对易关系就得到不确定性原理：

$$
\begin{equation}
\Delta q\,\Delta p \geq \frac{\hbar}{2}.
\end{equation}
$$

它不是额外附加的神秘假设，而是对易关系的直接推论。这也说明量子理论不是"经典力学加一点随机噪声"：经典随机性只是我们不知道系统究竟在哪个状态，量子不确定性更深，它来自状态变量本身的非对易结构。正因为 $q$ 和 $p$ 不能同时确定，系统才不能用一个相空间点描述，而必须用希尔伯特空间中的态矢量。

## 哈密顿算符与排序问题

经典函数 $H(q,p)$ 变成算符 $\hat H(\hat q,\hat p)$。以一维粒子为例，

$$
\begin{equation}
H(q,p)=\frac{p^2}{2m}+V(q)\ \longrightarrow\ \hat H=\frac{\hat p^2}{2m}+V(\hat q).
\end{equation}
$$

在位置表象下，对易关系迫使动量算符取微分形式

$$
\begin{equation}
\hat p = -i\hbar \frac{\partial}{\partial q},
\end{equation}
$$

于是哈密顿算符成为

$$
\begin{equation}
\hat H = -\frac{\hbar^2}{2m}\frac{\partial^2}{\partial q^2}+V(q).
\end{equation}
$$

这里顺带有一个微妙之处：经典表达式里 $qp$ 和 $pq$ 相同，量子化后却不同，含 $qp$ 混合项的哈密顿量存在排序歧义，需要额外约定（如对称化）。对上面这类"动能只含 $p$、势能只含 $q$"的常见系统，问题不出现，可以先放下。

# 时间演化

## 薛定谔方程

有了 $\hat H$，状态如何随时间变化由薛定谔方程给出：

$$
\begin{equation}
i\hbar \frac{\partial}{\partial t}|\psi(t)\rangle = \hat H |\psi(t)\rangle.
\end{equation}
$$

把上一节的 $\hat H$ 代入，就得到位置表象下熟悉的波动方程：

$$
\begin{equation}
i\hbar\frac{\partial}{\partial t}\psi(q,t) = \left[-\frac{\hbar^2}{2m}\frac{\partial^2}{\partial q^2}+V(q)\right]\psi(q,t).
\end{equation}
$$

## 演化算符与定态

如果 $\hat H$ 不显含时间，方程可以直接积分，演化由一个酉算符给出：

$$
\begin{equation}
|\psi(t)\rangle = e^{-i\hat H t/\hbar}|\psi(0)\rangle.
\end{equation}
$$

这正是经典图像的量子对应。经典哈密顿量通过正则方程生成相空间里的流；量子哈密顿算符通过 $e^{-i\hat H t/\hbar}$ 生成希尔伯特空间里的酉演化。把 $\hat H$ 理解成"时间演化的生成元"，比理解成"能量的量子版"更贴近它的角色——能量只是它的一个物理含义。从经典到量子的整条路线可以概括为

$$
\begin{equation}
H(q,p)\ \rightarrow\ \hat H(\hat q,\hat p)\ \rightarrow\ i\hbar\,\partial_t|\psi\rangle=\hat H|\psi\rangle.
\end{equation}
$$

## 薛定谔绘景与海森伯绘景

上面把时间放在态上、算符不动，这叫薛定谔绘景。也可以反过来：让态不动，把时间演化放到算符上，这叫海森伯绘景。定义 $\hat A_H(t)=e^{i\hat H t/\hbar}\hat A\,e^{-i\hat H t/\hbar}$，它满足

$$
\begin{equation}
\frac{d\hat A_H}{dt}=\frac{i}{\hbar}[\hat H,\hat A_H].
\end{equation}
$$

这就是海森伯方程，它和第三节的经典 $\dot A=\{A,H\}$ 在 $\{,\}\to\tfrac{1}{i\hbar}[,]$ 的对应下形式完全一致。两种绘景给出相同的可观测预言，只是把时间演化的"账"记在了不同对象上。

## 埃伦费斯特定理与经典极限

海森伯方程可以直接说明量子力学如何回到经典。取期望值 $\langle\hat q\rangle$、$\langle\hat p\rangle$，用对易关系算得

$$
\begin{equation}
\frac{d\langle\hat q\rangle}{dt}=\frac{\langle\hat p\rangle}{m},\qquad \frac{d\langle\hat p\rangle}{dt}=-\left\langle V'(\hat q)\right\rangle.
\end{equation}
$$

这是埃伦费斯特定理：期望值满足形式上与牛顿方程一样的关系。当波包足够窄、$\langle V'(\hat q)\rangle\approx V'(\langle\hat q\rangle)$ 时，质心就近似沿经典轨迹运动。经典力学因此是量子力学在这一近似下的平均行为，而不是与之无关的另一套规则。

# 能谱与本征态

$\hat H$ 成为算符后，一个自然的问题是它有哪些本征值。若

$$
\begin{equation}
\hat H|n\rangle = E_n|n\rangle,
\end{equation}
$$

则 $|n\rangle$ 是能量本征态，$E_n$ 是对应的能量。在这个态里测量能量，得到确定值 $E_n$。当 $\hat H$ 不显含时间时，本征态的演化格外简单，只积累一个相位：

$$
\begin{equation}
|n(t)\rangle = e^{-iE_n t/\hbar}|n(0)\rangle.
\end{equation}
$$

整体相位不改变任何测量概率，所以能量本征态又叫定态。一般态则展开到这组基上，$|\psi(0)\rangle=\sum_n c_n |n\rangle$，演化后成为

$$
\begin{equation}
|\psi(t)\rangle=\sum_n c_n\,e^{-iE_n t/\hbar}|n\rangle.
\end{equation}
$$

不同本征态积累不同相位，它们之间的相对相位随时间变化，这才产生可观测的振荡、干涉和跃迁。换句话说，能谱决定了系统的动态行为。谱可以是离散的（束缚态，如下面的谐振子），也可以是连续的（自由态，如平面波），还可以两者兼有。求解一个量子系统，很多时候就是求 $\hat H$ 的谱：

$$
\begin{equation}
\hat H\ \longrightarrow\ \{E_n,\ |n\rangle\}.
\end{equation}
$$

一旦 $\hat H$ 定下来，能级、基态、激发态和时间演化就都定下来了。这也是"写出哈密顿量再求本征值"成为标准套路的原因。

# 自由粒子

## 平面波与能谱

最简单的量子系统是没有势能的自由粒子，$V(q)=0$，哈密顿算符只剩动能项：

$$
\begin{equation}
\hat H = \frac{\hat p^2}{2m}=-\frac{\hbar^2}{2m}\frac{\partial^2}{\partial q^2}.
\end{equation}
$$

定态薛定谔方程 $-\tfrac{\hbar^2}{2m}\psi''=E\psi$ 的解是平面波 $\psi(q)=e^{ikq}$，代入得能量

$$
\begin{equation}
E=\frac{\hbar^2 k^2}{2m}.
\end{equation}
$$

由于动量本征值 $p=\hbar k$，能量又回到经典形式 $E=p^2/2m$。这说明量子化并没有推翻经典关系，只是把变量换成算符、把状态换成波函数：自由粒子的能量仍来自动量，但它的状态是平面波，而不是相空间里的一个点。因为没有束缚，能量取连续值，动量可以任意。

## 波包与扩散

平面波遍布全空间、不可归一，不能真的代表一个粒子。真实的粒子是许多平面波的叠加，即波包：

$$
\begin{equation}
\psi(q,t)=\int \frac{dk}{2\pi}\,\tilde\psi(k)\,e^{i(kq-\omega(k)t)},\qquad \omega(k)=\frac{\hbar k^2}{2m}.
\end{equation}
$$

波包的中心以群速度 $v_g=d\omega/dk=\hbar k/m=p/m$ 移动，正是经典速度。但由于 $\omega(k)$ 不是 $k$ 的线性函数（色散），不同分量以不同相速度传播，波包会随时间展宽。这个扩散是自由量子粒子的固有行为，也再次体现了不确定性：初始把粒子定位得越窄（$\Delta q$ 小），就需要越宽的动量分布（$\Delta p$ 大），随后展宽也越快。有束缚势的系统则不同——势把粒子关在有限区域内，谱往往变成离散的。谐振子是最重要的这类例子。

# 谐振子

## 能谱与零点能

谐振子的经典哈密顿量是

$$
\begin{equation}
H(q,p)=\frac{p^2}{2m}+\frac{1}{2}m\omega^2q^2,
\end{equation}
$$

动能加上弹性势能，对应小球在平衡点附近的往复振动。它的重要性在于普适：几乎任何势在稳定平衡点附近做泰勒展开，最低阶都是二次的，所以微小振动总近似为谐振子。量子化后

$$
\begin{equation}
\hat H=\frac{\hat p^2}{2m}+\frac{1}{2}m\omega^2\hat q^2.
\end{equation}
$$

它的能谱是等间距的离散能级：

$$
\begin{equation}
E_n=\hbar\omega\left(n+\frac{1}{2}\right),\qquad n=0,1,2,\ldots
\end{equation}
$$

相邻能级间隔固定为 $\Delta E=\hbar\omega$。最低能级 $n=0$ 的能量不是零，而是零点能 $E_0=\tfrac12\hbar\omega$。它的存在直接来自不确定性原理：如果粒子静止在势能最低点，位置和动量就同时确定为 $q=0$、$p=0$，违反 $\Delta q\,\Delta p\geq\hbar/2$。所以量子谐振子即使在基态也保留着不可消除的涨落，不能像经典小球那样彻底停在谷底。

## 升降算符

谐振子有一个特别简洁的代数解法。定义

$$
\begin{equation}
\hat a=\sqrt{\frac{m\omega}{2\hbar}}\,\hat q+\frac{i}{\sqrt{2m\hbar\omega}}\,\hat p,
\end{equation}
$$

$$
\begin{equation}
\hat a^\dagger=\sqrt{\frac{m\omega}{2\hbar}}\,\hat q-\frac{i}{\sqrt{2m\hbar\omega}}\,\hat p,
\end{equation}
$$

分别称为湮灭算符和产生算符。由 $[\hat q,\hat p]=i\hbar$ 可算出 $[\hat a,\hat a^\dagger]=1$。哈密顿量可以改写成

$$
\begin{equation}
\hat H=\hbar\omega\left(\hat a^\dagger \hat a+\frac{1}{2}\right),
\end{equation}
$$

其中粒子数算符 $\hat N=\hat a^\dagger \hat a$ 的本征值是 $n=0,1,2,\ldots$，直接给出上面的能谱。$\hat a^\dagger$ 把系统从第 $n$ 级抬到第 $n+1$ 级，$\hat a$ 把它降到第 $n-1$ 级：

$$
\begin{equation}
\hat a^\dagger|n\rangle=\sqrt{n+1}\,|n+1\rangle,\qquad \hat a|n\rangle=\sqrt{n}\,|n-1\rangle.
\end{equation}
$$

能级像一架梯子，激发可以一份一份地增减。梯子有底：$\hat a|0\rangle=0$，这个条件也定出了基态。

## 基态波函数与相干态

把 $\hat a|0\rangle=0$ 写成位置表象下的一阶微分方程 $\big(\sqrt{\tfrac{m\omega}{2\hbar}}\,q+\sqrt{\tfrac{\hbar}{2m\omega}}\,\partial_q\big)\psi_0=0$，解得基态是一个高斯波包：

$$
\begin{equation}
\psi_0(q)\propto \exp\!\left(-\frac{m\omega}{2\hbar}q^2\right).
\end{equation}
$$

它的宽度正好使 $\Delta q\,\Delta p=\hbar/2$ 取到下界，是"最省"的量子态。湮灭算符的本征态 $\hat a|\alpha\rangle=\alpha|\alpha\rangle$ 称为相干态，它们是移动的高斯波包，其期望值沿经典轨迹振荡而形状不散，是最接近经典简谐运动的量子态，在光学和激光里非常重要。

## 为什么谐振子是基本积木

这个升降结构后来在量子场论里会反复出现。场可以分解成无穷多个谐振子模式，每个模式都有自己的产生和湮灭算符，而"粒子"就是某个场模式上的一份量子激发。所以场论中"产生一个粒子"不是比喻，而是产生算符作用在态上的具体操作 $|n+1\rangle\propto\hat a^\dagger|n\rangle$。谐振子因此不是一个孤立小例子，而是量子理论的基本积木；第十六节会把这条线接到场。

# 角动量与中心势

第四节里旋转对称对应角动量，量子力学中这条线索给出离散的角动量谱，也是原子结构的基础，值得单列一节。

角动量算符 $\hat L_i=\epsilon_{ijk}\hat x_j\hat p_k$ 满足由 $[\hat x,\hat p]=i\hbar$ 导出的对易关系

$$
\begin{equation}
[\hat L_i,\hat L_j]=i\hbar\,\epsilon_{ijk}\hat L_k.
\end{equation}
$$

三个分量互不对易，所以不能同时确定，但 $\hat L^2$ 与任一分量（习惯取 $\hat L_z$）对易，可以共同对角化。用与谐振子类似的升降算符技巧（$\hat L_\pm=\hat L_x\pm i\hat L_y$）可以证明，本征值是量子化的：

$$
\begin{equation}
\hat L^2|\ell,m\rangle=\hbar^2\ell(\ell+1)|\ell,m\rangle,\qquad \hat L_z|\ell,m\rangle=\hbar m|\ell,m\rangle,
\end{equation}
$$

其中 $\ell=0,1,2,\dots$，$m=-\ell,\dots,\ell$。方向也被量子化了——这是经典完全没有的现象。

对中心势 $V(r)$，哈密顿量与 $\hat L^2$、$\hat L_z$ 都对易，于是能量本征态可以同时是角动量本征态，波函数分离为径向部分乘球谐函数 $\psi=R_{n\ell}(r)Y_{\ell m}(\theta,\varphi)$。氢原子就是这样解出来的：库仑势 $V\propto -1/r$ 下能级 $E_n\propto -1/n^2$，加上角动量与自旋量子数，直接给出元素周期表的壳层结构。对称性（旋转不变）在这里不只是给出守恒量，还整块地简化了求解，并决定了能级的简并——这正是"先看对称性"这一思路的威力。

# 传播子

有了状态、算符和演化，就可以转到路径积分。它需要的核心对象是传播子。波函数 $\psi(q,t)$ 给出粒子出现在各处的概率振幅，已知初始波函数，末时刻的波函数可以由一个积分核给出：

$$
\begin{equation}
\psi(q_f,t_f)=\int K(q_f,t_f;q_i,t_i)\,\psi(q_i,t_i)\,dq_i.
\end{equation}
$$

这个核 $K$ 就是传播子，它告诉我们初始位置 $q_i$ 上的振幅经过一段时间后如何贡献到末位置 $q_f$。用第七节的演化算符可以把它写清楚：$K$ 正是演化算符在位置表象下的矩阵元，

$$
\begin{equation}
K(q_f,t_f;q_i,t_i)=\langle q_f|\,e^{-i\hat H(t_f-t_i)/\hbar}\,|q_i\rangle.
\end{equation}
$$

这一个式子就是算符语言和路径积分语言的接口。左边强调演化算符和能量生成动力学，接下来要做的，是把右边改写成对所有路径求和。

# 从哈密顿量到路径积分

## 从一条路径到所有路径

经典力学里，从初态到末态的候选路径有无穷多条，但真正发生的只有满足 $\delta S=0$ 的一条。量子力学改变了这一图景。双缝实验表明，即使单个粒子逐个发射，最终仍形成干涉条纹——粒子的传播不能只用一条确定轨迹描述，必须包含不同路径之间的相位关系。路径积分把这一点写成公式：不假设粒子只走一条路，而是让从 $q_i$ 到 $q_f$ 的每一条路径都按其作用量贡献一个复相位 $\exp(iS[q]/\hbar)$，全部加起来得到传播子：

$$
\begin{equation}
K(q_f,t_f;q_i,t_i)=\int \mathcal{D}q(t)\,\exp\!\left(\frac{i}{\hbar}S[q]\right),
\end{equation}
$$

其中 $\int \mathcal{D}q(t)$ 表示对所有连接两端点的路径求和。这不是新假设，而可以从上一节的矩阵元直接推出来。

## 时间切片

把总时间切成 $N$ 小段，$t_f-t_i=N\Delta t$，演化算符相应地写成 $N$ 个短时间因子的乘积：

$$
\begin{equation}
e^{-i\hat H(t_f-t_i)/\hbar}=\left(e^{-i\hat H\Delta t/\hbar}\right)^{N}.
\end{equation}
$$

在相邻因子之间插入位置基的完备性关系 $\int dq_k\,|q_k\rangle\langle q_k|=I$，整体矩阵元就被拆成一串短时间矩阵元的连乘并对中间位置积分：

$$
\begin{equation}
K=\int dq_1\cdots dq_{N-1}\ \prod_{k=0}^{N-1}\langle q_{k+1}|e^{-i\hat H\Delta t/\hbar}|q_k\rangle.
\end{equation}
$$

## 短时间传播子

关键是算单个短时间矩阵元。对 $\hat H=\tfrac{\hat p^2}{2m}+V(\hat q)$，在 $O(\Delta t)$ 精度内可以把动能和势能因子分开（Trotter 分解），势能作用在 $|q_k\rangle$ 上给出数 $V(q_k)$，动能部分插入动量完备性 $\int\tfrac{dp}{2\pi\hbar}|p\rangle\langle p|$ 化成一个高斯积分：

$$
\begin{equation}
\langle q_{k+1}|e^{-i\hat H\Delta t/\hbar}|q_k\rangle
\approx e^{-\frac{i}{\hbar}V(q_k)\Delta t}\int\frac{dp}{2\pi\hbar}\,e^{\frac{i}{\hbar}p(q_{k+1}-q_k)}e^{-\frac{i}{\hbar}\frac{p^2}{2m}\Delta t}.
\end{equation}
$$

对 $p$ 做高斯积分（配方），得到

$$
\begin{equation}
\langle q_{k+1}|e^{-i\hat H\Delta t/\hbar}|q_k\rangle
\approx \sqrt{\frac{m}{2\pi i\hbar\Delta t}}\ \exp\!\left\{\frac{i}{\hbar}\Delta t\left[\frac{m}{2}\left(\frac{q_{k+1}-q_k}{\Delta t}\right)^2-V(q_k)\right]\right\}.
\end{equation}
$$

方括号里正是拉格朗日量 $L=\tfrac12 m\dot q^2-V$ 在这一小段上的值。所以每个短时间因子携带的相位就是 $\tfrac{i}{\hbar}L\,\Delta t$——作用量不是硬塞进来的，而是从哈密顿量的短时间演化里自己长出来的。

## 连续极限

把 $N$ 个因子连乘，相位相加成 $\tfrac{i}{\hbar}\sum_k L\,\Delta t$，当切分越来越细时求和过渡为积分 $\tfrac{i}{\hbar}\int L\,dt=\tfrac{i}{\hbar}S[q]$，而对中间位置的多重积分定义了路径测度：

$$
\begin{equation}
\int dq_1\,dq_2\cdots dq_{N-1}\ \longrightarrow\ \int \mathcal{D}q(t).
\end{equation}
$$

于是整条链条是

$$
\begin{equation}
\hat H\ \rightarrow\ e^{-i\hat H t/\hbar}\ \rightarrow\ K(q_f,t_f;q_i,t_i)\ \rightarrow\ \int \mathcal{D}q\,e^{iS[q]/\hbar}.
\end{equation}
$$

哈密顿量提供演化的生成元，路径积分提供演化的路径展开。它们不是两套竞争的理论，而是同一个量子力学的两种等价语言。

# 权重 $e^{iS/\hbar}$ 与经典极限

## 相位干涉

路径积分顺带解释了为什么宏观世界看起来仍然遵守经典力学。每条路径的贡献 $\exp(iS[q]/\hbar)$ 是一个纯相位，模长恒为 1，随路径变化的只是相位角 $S[q]/\hbar$。当作用量 $S$ 远大于 $\hbar$ 时，路径稍有改变就会让相位剧烈转动，相邻路径的贡献方向各异，在求和中相互抵消——它们不是没参与，而是参与后彼此消去了。

只有在一处例外：作用量对路径变化不敏感的地方，即 $\delta S=0$。在这条路径附近，微小改变不改变作用量的一阶量，相邻路径的相位变化缓慢，贡献能够稳定叠加。而 $\delta S=0$ 恰恰是经典驻定作用量原理挑出的那条路径。

## 稳相近似

这在数学上就是稳相近似：形如 $\int dx\,g(x)e^{if(x)/\hbar}$ 的积分，当 $\hbar\to0$ 时主要贡献来自 $f'(x)=0$ 的驻点，其余处的快速振荡相互抵消。用到路径积分上，

$$
\begin{equation}
\hbar \rightarrow 0\ \Longrightarrow\ \text{主导贡献来自}\ \delta S = 0,
\end{equation}
$$

在驻点附近展开到二阶还能给出经典轨迹之上的量子涨落修正（半经典近似）。经典路径不是事先指定的，而是从所有量子路径的相位干涉中浮现出来的：微观世界保留了所有路径的振幅结构，宏观世界因为相位抵消而表现得像只有一条确定轨迹。经典的驻定作用量原理，正是量子路径积分在经典极限下留下的稳定结构。

# 欧氏路径积分与统计物理

## 维克转动

实时间路径积分里的权重是振荡因子 $e^{iS/\hbar}$，理论上优美，实际计算却困难：不同路径剧烈相消，数值积分很不稳定。一个关键技巧是维克转动，把实时间 $t$ 换成虚时间 $\tau$：

$$
\begin{equation}
t = -i\tau.
\end{equation}
$$

在这个替换下，振荡权重变成指数衰减的权重：

$$
\begin{equation}
\exp\!\left(\frac{i}{\hbar}S\right)\ \longrightarrow\ \exp\!\left(-\frac{1}{\hbar}S_E\right),
\end{equation}
$$

其中 $S_E$ 是欧氏作用量，动能项的符号翻转使它成为 $S_E=\int d\tau\,(\tfrac12 m\dot q^2+V)$——注意势能前变成加号，它更像一个处处非负的"代价"。路径按 $S_E$ 的大小被指数加权，而不是相互抵消，数值上稳定得多。

## 配分函数对应

这个结构和统计物理里的玻尔兹曼权重几乎一模一样。系统处在能量为 $E$ 的状态的权重是 $\exp(-\beta E)$，$\beta=1/k_BT$。对照欧氏权重 $\exp(-S_E/\hbar)$，两者形式上完全对应。这不是巧合：量子配分函数

$$
\begin{equation}
Z=\mathrm{Tr}\,e^{-\beta\hat H}=\int dq\,\langle q|e^{-\beta\hat H}|q\rangle
\end{equation}
$$

正是把演化算符里的 $it/\hbar$ 换成 $\beta$，也就是让系统在虚时间里演化一段"时长" $\hbar\beta$，并且首末位置相同（取迹）。所以有限温度量子系统就等价于一个虚时间方向上周期为 $\hbar\beta$ 的欧氏路径积分：

$$
\begin{equation}
Z=\oint \mathcal{D}q\,\exp\!\left(-\frac{1}{\hbar}S_E[q]\right),\qquad q(\tau+\hbar\beta)=q(\tau).
\end{equation}
$$

温度越高周期越短，$T\to0$ 则周期趋于无穷。很多宏观量都能从 $Z$ 导出，例如自由能 $F=-\beta^{-1}\log Z$。这条对应是有限温度场论、相变分析和格点蒙特卡洛方法的共同基础。

## 基态投影

虚时间还能直接投影出基态。实时间演化 $e^{-i\hat H t/\hbar}$ 转到虚时间成为 $e^{-\hat H\tau/\hbar}$。把任意初态展开到能量本征态 $|\psi\rangle=\sum_n c_n|n\rangle$，虚时间演化后各分量被 $e^{-E_n\tau/\hbar}$ 加权：

$$
\begin{equation}
e^{-\hat H \tau/\hbar}|\psi\rangle=\sum_n c_n\,e^{-E_n\tau/\hbar}|n\rangle.
\end{equation}
$$

当 $\tau$ 很大时，高能项衰减更快，只要初态与基态不正交，剩下的就主要是能量最低的基态。所以欧氏路径积分像一个滤波器，逐渐压掉高能激发、留下低能结构，常被用来研究基态和低温物理。基态之所以重要，是因为材料结构、相变、真空涨落、低温性质大多由它决定。哈密顿量定义能谱，欧氏路径积分则通过指数权重把基态筛出来——一个从算符谱的角度，一个从构型求和的角度，描述同一件事。

# 从粒子路径到场

## 场作为耦合谐振子的连续极限

要理解场论的路径积分，最好的入口是把第十节的谐振子接过来。设想空间被离散成一排格点，每个格点 $i$ 上有一个位移变量 $\phi_i$，相邻格点之间用弹簧连起来。这个系统的哈密顿量是一堆动能项加上近邻耦合的势能项，正是一串耦合谐振子。做正则变换到简正模式后，它解耦成一组独立的谐振子，每个模式有自己的频率和产生、湮灭算符。

现在让格点间距趋于零，$\phi_i$ 就变成一个连续的场 $\phi(x,t)$，近邻耦合项 $(\phi_{i+1}-\phi_i)^2$ 变成梯度平方 $(\partial_x\phi)^2$。场论不过是"每个空间点一个自由度"的连续极限，而它的量子激发——每个简正模式上的一份份能量——就是我们叫作粒子的东西。电磁场的量子是光子，电子场的量子是电子。这样，"粒子"从一开始就被理解为场的激发，而不是独立的基本客体。

## 场的路径积分

沿用第十三节的推导，只是把变量从一条轨迹 $q(t)$ 换成整个时空上的场 $\phi(x,t)$，路径积分就变成对所有场构型求和：

$$
\begin{equation}
Z=\int \mathcal{D}\phi\,\exp\!\left(\frac{i}{\hbar}S[\phi]\right),
\end{equation}
$$

用欧氏时间则写成 $Z=\int \mathcal{D}\phi\,\exp(-S_E[\phi]/\hbar)$。表面上只是 $q(t)\to\phi(x,t)$，但概念变化很大：量子力学的路径积分关心粒子如何传播，量子场论的路径积分关心整个场如何涨落，而粒子的产生和湮灭就是场构型的量子激发变化，对应第十节里产生、湮灭算符作用在态上。

## 一个统一的范式

这里浮现出一个通用的建模范式：给定系统所有可能的构型，为每个构型按作用量或能量分配权重，再对所有构型求和。

- 经典力学中，主导的是驻定作用量的单条路径；
- 量子力学中，所有路径以复相位 $e^{iS/\hbar}$ 共同贡献；
- 统计物理中，所有状态按玻尔兹曼权重 $e^{-\beta E}$ 贡献；
- 量子场论中，所有场构型按作用量权重贡献。

路径积分不是某一个具体技巧，而是把"可能性空间"和"权重函数"结合起来的统一语言，这也是它能横跨量子力学、统计物理和场论的原因。

# 相关函数与生成泛函

## 相关函数

在场论里，单个场构型本身不可观测，真正有物理意义的是不同时空点之间的相关函数。两点相关函数是

$$
\begin{equation}
\langle \phi(x_1)\phi(x_2) \rangle=\frac{1}{Z}\int \mathcal{D}\phi\,\phi(x_1)\phi(x_2)\,\exp\!\left(\frac{i}{\hbar}S[\phi]\right),
\end{equation}
$$

它衡量场在两个时空点上的关联：在 $x_1$ 处扰动场，这个扰动多大程度上影响 $x_2$。更高阶的相关函数含更多点，$\langle \phi(x_1)\cdots\phi(x_n)\rangle$，它们进一步连接到散射振幅和相互作用强度。用统计物理类比，相关函数就是在玻尔兹曼分布下求某个量的期望，路径积分只是把状态求和换成构型积分——逻辑始终一致：先定义所有构型，再定义每个构型的权重，最后对关心的量做加权平均。

## 自由场与 Wick 定理

对自由场（作用量是二次型），路径积分是高斯型的，可以精确求值。两点函数就是传播子 $G(x-y)=\langle\phi(x)\phi(y)\rangle_0$。高斯积分有一个漂亮的性质：任意多点函数都能拆成两两配对的传播子之和，这就是 Wick 定理，例如

$$
\begin{equation}
\langle\phi_1\phi_2\phi_3\phi_4\rangle_0=G_{12}G_{34}+G_{13}G_{24}+G_{14}G_{23},
\end{equation}
$$

奇数个场的期望为零。Wick 定理是费曼图的组合学根基：每一种配对方式对应一张图的一种连线方式。

## 生成泛函

为了系统地生成各阶相关函数，给场加一个外源 $J(x)$：

$$
\begin{equation}
Z[J]=\int \mathcal{D}\phi\,\exp\!\left[\frac{i}{\hbar}\left(S[\phi]+\int J(x)\phi(x)\,dx\right)\right].
\end{equation}
$$

$J(x)$ 像一个外部探针，在每个时空点上轻微耦合到场，用来测系统对扰动的响应。相关函数就是 $Z[J]$ 对 $J$ 的泛函导数，例如（略去与 $i/\hbar$ 相关的常数因子）

$$
\begin{equation}
\langle \phi(x_1)\phi(x_2)\rangle=\frac{1}{Z[0]}\left.\frac{\delta^2 Z[J]}{\delta J(x_1)\,\delta J(x_2)}\right|_{J=0}.
\end{equation}
$$

只要知道 $Z[J]$，对外源求不同阶导数就能生成全部相关函数。对自由场，这个 $Z[J]$ 甚至能写成闭式 $Z[J]=Z[0]\exp\!\big(-\tfrac{1}{2}\int J\,G\,J\big)$，Wick 定理正是它逐次求导的结果。生成泛函因此像场论的一个总接口，把无穷多个相关函数组织进一个对象里。

# 自由场、相互作用与费曼图

## 拆分与传播子

要真正算出这些积分，通常把作用量拆成自由部分和相互作用部分：

$$
\begin{equation}
S[\phi]=S_0[\phi]+S_{\mathrm{int}}[\phi].
\end{equation}
$$

自由部分是二次型，比如标量场的自由作用量

$$
\begin{equation}
S_0[\phi]=\int d^4x\,\left[\frac{1}{2}\partial_\mu\phi\,\partial^\mu\phi-\frac{1}{2}m^2\phi^2\right].
\end{equation}
$$

二次型对应高斯积分，可以精确求解。自由场描述没有相互作用的传播：粒子从一点走到另一点，彼此之间不发生散射。这个传播由传播子刻画，$G(x-y)=\langle\phi(x)\phi(y)\rangle_0$，它是费曼图里的线。

## 微扰展开

相互作用部分是更高阶的项。以 $\phi^4$ 理论为例，

$$
\begin{equation}
S[\phi]=S_0[\phi]-\int d^4x\,\frac{\lambda}{4!}\phi^4,
\end{equation}
$$

$\lambda$ 是相互作用强度。这个四次项让路径积分不再能像自由场那样精确求解。标准做法是把相互作用当作对自由理论的微扰，把指数展开成级数：

$$
\begin{equation}
\exp\!\left[\frac{i}{\hbar}S_{\mathrm{int}}\right]=1+\frac{i}{\hbar}S_{\mathrm{int}}+\frac{1}{2!}\left(\frac{i}{\hbar}S_{\mathrm{int}}\right)^2+\cdots.
\end{equation}
$$

代进相关函数后，每一项都变成自由场里若干个 $\phi$ 的期望，可以用 Wick 定理拆成传播子的乘积。这样，一个难算的相互作用理论就被化成了一堆自由传播子按规则拼接的组合问题。

## 费曼图与费曼规则

费曼图就是这个展开的图形记账法：

```text
线   = 自由传播子 G(x-y)
顶点 = 相互作用项，每个带一个耦合 λ，位置要积分
外腿 = 被观测或散射的粒子
内点 = 需要积分的中间相互作用位置
环   = 未定的内部动量，要对其积分
```

$\phi^4$ 里 $\phi^4(x)$ 表示同一点上四个场相乘，图形上就是四条线汇聚的顶点。每张图对应展开里的一类数学项，顶点越多对应的微扰阶数越高。费曼规则把每张图翻译成一个确定的积分：给每条线一个传播子、每个顶点一个 $\lambda$ 并积分其位置、每个环积分其动量。若相互作用弱（$\lambda$ 小），低阶（少顶点）图贡献最大，高阶图作为修正逐步加入，这正是微扰量子场论能工作的前提。费曼图不是另一套神秘规则，而是把复杂的泛函积分转成一系列可按规则计算的图结构。路径积分、生成泛函、相关函数、费曼图属于同一条逻辑链：路径积分给出总体形式，生成泛函组织可观测量，相关函数描述物理响应，费曼图给出实际计算的展开规则。

# 散射、重整化与有效场论

## 从相关函数到散射

量子场论最终要解释的核心现象之一是散射：两个粒子靠近、相互作用、再变成别的粒子离开。实验测到的不是某个抽象场构型，而是入射态到出射态的概率振幅。相关函数是连接理论与实验的中间对象——一个四点相关函数经过约化公式处理，可以提取出散射振幅，实验截面则由振幅的模平方给出。费曼图里看起来像粒子沿线传播、在顶点相互作用，更准确地说是在描述场相关函数的微扰结构。也正因为基本对象是场而非固定数目的粒子，场论能自然处理粒子数变化：高能粒子可以产生粒子对，粒子也可以湮灭成其他场的激发。

## 发散与正规化

用费曼图实际计算时会遇到一个严重问题：含环的图里，内部动量要对所有取值积分，例如

$$
\begin{equation}
\int d^4p\,\frac{1}{(p^2-m^2)\cdots},
\end{equation}
$$

其中包含任意大的动量，即任意短的距离尺度，许多这样的积分在高动量区发散。正规化是先给积分一个人为的截断（能量截断 $\Lambda$、维数正规化等），把无穷大暂时变成依赖截断的有限量，好让计算能进行下去。

## 重整化

这一开始像理论崩溃，后来人们意识到：发散并不意味着理论没有物理意义，而是提醒我们不能天真地假设理论在所有尺度上都以同样形式成立。物理测量总在有限尺度上进行，我们测到的质量、电荷、耦合常数并不是拉格朗日量里写进去的裸参数，而是已经包含量子涨落修正后的有效参数。重整化的核心思想就是把发散吸收进参数的重新定义，让最终可观测量保持有限。比如裸质量 $m_0$ 加上一个（依赖截断的）发散修正 $\delta m$：

$$
\begin{equation}
m_{\mathrm{phys}} = m_0 + \delta m.
\end{equation}
$$

$m_0$ 和 $\delta m$ 单独可能都随截断发散，但组合出的 $m_{\mathrm{phys}}$ 有限，可与实验对应。若一个理论只需重新定义有限几个参数就能吸收掉所有发散，就称它可重整。

## 重整化群与跑动耦合

重整化的一个深刻推论是：参数不是永恒不变的绝对常数，而依赖观测尺度。同一个耦合，在不同能量尺度 $\mu$ 下测到的值不同，这叫跑动耦合 $g(\mu)$，其变化由重整化群方程（β 函数）描述：

$$
\begin{equation}
\mu\frac{dg}{d\mu}=\beta(g).
\end{equation}
$$

$\beta$ 的符号决定耦合随能量增大是变强还是变弱。量子电动力学里耦合随能量增大（低能是我们熟悉的精细结构常数），而量子色动力学的 $\beta<0$，耦合随能量增大反而变弱——这就是渐近自由，解释了为什么夸克在高能下近乎自由、在低能下被牢牢束缚。

## 有效场论

顺着这个思路就到了有效场论。如果一个理论在高能尺度有未知细节，我们并不一定要知道那些细节才能描述低能现象——低能观测通常对高能自由度不敏感，高能的影响可以压缩进有限几个有效参数和高阶修正项里。有效场论不追求一次写出所有尺度上的终极理论，而是在给定能量尺度下只保留对该尺度重要的自由度和相互作用。在作用量里，这表现为允许出现所有满足对称性的项：

$$
\begin{equation}
S_{\mathrm{eff}}=\int d^4x\,\left[\mathcal{L}_0+\sum_i c_i\,\mathcal{O}_i\right],
\end{equation}
$$

$\mathcal{O}_i$ 是各种算符，$c_i$ 是系数，低维算符在低能下更重要，高维算符被高能尺度压制。路径积分在这里仍是基础语言，因为它天然允许把某些自由度积掉、得到剩余自由度的有效作用量：

$$
\begin{equation}
e^{iS_{\mathrm{eff}}[\phi_{\mathrm{low}}]/\hbar}=\int \mathcal{D}\phi_{\mathrm{high}}\,e^{iS[\phi_{\mathrm{low}},\phi_{\mathrm{high}}]/\hbar}.
\end{equation}
$$

把高能自由度的所有构型加权求和，就得到只关于低能自由度的有效理论。路径积分由此不只是量子理论的表达工具，更是一种系统地"消去变量、得到有效描述"的方法。

# 对称性的量子语言

第四节在经典层面讲了对称性给出守恒量。进入量子力学后，这套关系并没有消失，只是通过第六节的 $\{,\}\to\tfrac{1}{i\hbar}[,]$ 对应换成了算符和对易关系。

## 对易关系与守恒量

量子可观测量由算符 $\hat A$ 表示。若 $\hat A$ 不显含时间，它的演化满足海森伯方程 $\tfrac{d\hat A}{dt}=\tfrac{i}{\hbar}[\hat H,\hat A]$（第七节），于是守恒变成一个纯代数条件：

$$
\begin{equation}
[\hat H,\hat A]=0\ \Longrightarrow\ \frac{d\hat A}{dt}=0.
\end{equation}
$$

这正是经典 $\{H,A\}=0$ 的量子对应。哈密顿量与动量算符对易则动量守恒，与角动量算符对易则角动量守恒，与某个内部对称性的生成元对易则对应的量子数守恒。守恒律可以从 $\hat H$ 的对称性直接读出，$\hat H$ 因此不只告诉我们系统怎么演化，也告诉我们哪些结构在演化中不会消失。

## 生成元的统一视角

许多连续变换都由某个厄米算符指数化生成：

$$
\begin{equation}
\begin{aligned}
\text{时间平移:}\quad & U(t)=e^{-i\hat H t/\hbar},\\
\text{空间平移:}\quad & T(a)=e^{-i\hat p a/\hbar},\\
\text{旋转:}\quad & R(\theta)=e^{-i\hat L\theta/\hbar}.
\end{aligned}
\end{equation}
$$

哈密顿量的特殊地位在于它是时间平移的生成元：系统随时间演化，本质上就是沿 $\hat H$ 生成的酉变换在希尔伯特空间里移动，正对应经典系统沿 $H$ 生成的相空间流。一个量既是某对称变换的生成元、又与 $\hat H$ 对易时，它就是守恒荷。

## 诺特流与场论中的对称性

在场论里，连续对称性的守恒量以局域的诺特流 $j^\mu(x)$ 出现，满足连续性方程

$$
\begin{equation}
\partial_\mu j^\mu=0,
\end{equation}
$$

对空间积分给出守恒荷 $Q=\int d^3x\,j^0$，$\tfrac{dQ}{dt}=0$。路径积分里对称性由作用量和积分测度的不变性表达：若一个变换让作用量不变 $S[\phi]\to S[\phi]$（且测度不变），则权重 $e^{iS[\phi]/\hbar}$ 不变，整个构型求和在该变换下保持结构稳定。把这个不变性用到生成泛函上，就得到 Ward 恒等式——它是相关函数之间由对称性强制的关系，量子层面的诺特定理。对称性会限制哪些相关函数非零、哪些相互作用项可以出现、哪些过程被禁止。

## 规范对称性

若把一个全局对称性提升为局域的（变换参数随时空点变化），要保持作用量不变就必须引入新的场——规范场，并把普通导数换成协变导数 $\partial_\mu\to D_\mu=\partial_\mu-igA_\mu$，这叫最小耦合。这一步几乎唯一地确定了相互作用的形式：电磁、弱、强相互作用都由规范对称性（$U(1)$、$SU(2)$、$SU(3)$）产生。于是现代物理常常不是先猜一个力，而是先问系统应满足什么对称性，再看这些对称性允许怎样的作用量或哈密顿量。一旦定下来，动力学和可观测量也就随之确定——这与开头牛顿"从具体的力出发"的思路正好相反。



把整条线收拢，中心对象始终是哈密顿量和作用量这两个，加上连接它们与对称性的泊松括号/对易子。

经典力学里，哈密顿量是相空间上的能量函数 $H(q,p)$，通过正则方程（等价地通过泊松括号 $\dot A=\{A,H\}$）生成相空间流；作用量 $S[q]$ 通过 $\delta S=0$ 挑出真实路径；刘维尔定理保证相空间体积守恒，为统计描述铺路。量子力学里，泊松括号按 $\{,\}\to\tfrac{1}{i\hbar}[,]$ 变成对易子，哈密顿量变成希尔伯特空间上的算符 $\hat H$：它的本征值给出能级 $\hat H|n\rangle=E_n|n\rangle$，它的指数给出时间演化 $e^{-i\hat H t/\hbar}$，它的虚时间指数 $e^{-\hat H\tau/\hbar}$ 筛出基态、并给出配分函数 $Z=\mathrm{Tr}\,e^{-\beta\hat H}$。作用量则通过 $e^{iS/\hbar}$ 成为路径积分里每条路径的相位权重，把量子演化写成所有历史的叠加，欧氏化后与统计物理的配分函数对应，并在场论里推广为对所有场构型求和。二者由传播子

$$
\begin{equation}
K(q_f,t_f;q_i,t_i)=\langle q_f|\,e^{-i\hat H(t_f-t_i)/\hbar}\,|q_i\rangle=\int \mathcal{D}q\,e^{iS[q]/\hbar}
\end{equation}
$$

连成同一件事：左边是算符生成的演化，右边是所有路径的相位求和。

再叠上对称性，就得到一条更长的脉络：

$$
\begin{equation}
\text{对称性}\ \rightarrow\ \text{守恒量}\ \rightarrow\ \text{生成元}\ \rightarrow\ \text{动力学}.
\end{equation}
$$

时间平移对应能量，空间平移对应动量，旋转对应角动量；在经典力学里它们是相空间中泊松括号为零的守恒量，在量子力学里是与 $\hat H$ 对易的算符，在路径积分里是作用量和积分测度的不变性（诺特流与 Ward 恒等式）。哈密顿量、作用量与对称性反复一起出现，因为它们不是三套独立概念，而是同一个动力系统在不同语言下的投影——从牛顿的力，到拉格朗日的作用量，到哈密顿的能量与相空间，再到希尔伯特空间上的算符与场的路径积分，讲的始终是同一件事：一个系统能怎样运动，以及在所有可能之中，什么被真正实现、什么被保持不变。

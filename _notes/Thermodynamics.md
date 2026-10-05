---
title: '第一性原理分析热力学和统计力学'
date: '2025-05'
summary: 'Statistical mechanics is built upon the postulate of equal probability, which bridges deterministic microscopic mechanics and macroscopic thermodynamics. This foundation allows for the derivation of entropy and temperature, ultimately unifying classical and quantum descriptions through ensemble theory. '
tags: ['Physics','Quantum Mechanics','Statistical mechanics']
---

![](https://raw.githubusercontent.com/neptune-t/aca-web-html/main/public/img/Theory/thermodynamics.png)

> “一个笨人能理解的东西，其他人也能理解。” — Richard Feynman

研究一个系统，首先要说清它处于什么状态。热力学教材通常从平衡态讲起：没有外界影响时，系统各部分的宏观性质（温度、体积等）长时间保持不变。

这篇笔记换一个起点。我们只假设微观粒子遵循的力学规律，不预先引入温度、熵这类宏观概念，看看能否从力学和一个统计假设出发，把它们一步步推出来。

# 微观世界的力学原理

考虑一个由 $N$ 个无内部结构的粒子组成的系统，它被限制在体积 $V$ 内，并且与外界完全隔离。第一步是说清这个系统的微观状态是什么，以及它如何随时间演化。下面分别用经典力学和量子力学来描述。

在经典力学里，$N$ 个粒子的状态由所有粒子的广义坐标 $\{q_i\}_{i=1}^{3N}$ 和广义动量 $\{p_i\}_{i=1}^{3N}$ 完全确定。把这 $6N$ 个变量当作坐标轴，就得到 $6N$ 维的相空间（$\Gamma$ 空间）。系统的一个微观状态对应相空间中的一个点，它的演化对应相空间中的一条轨迹。轨迹由哈密顿量 $H(\{q_i\}, \{p_i\})$ 决定，具体由哈密顿正则方程给出：

$$
\begin{equation}
\dot{q}_i = \frac{\partial H}{\partial p_i}, \quad \dot{p}_i = - \frac{\partial H}{\partial q_i} \quad (i = 1, \dots, 3N)
\end{equation}
$$

对孤立系统，总能量守恒，即 $H(\{q_i\}, \{p_i\}) = E$。因此轨迹不能跑遍整个相空间，只能停留在能量为 $E$ 的 $6N-1$ 维等能面上。

经典力学的描述是完全确定的：给定初始点，哈密顿方程就唯一确定了整条轨迹，包括过去和未来。

原子和分子更基本的描述来自量子力学。$N$ 粒子系统的微观状态是多粒子希尔伯特空间 $\mathcal{H}$ 中的态矢量 $|\Psi(t)\rangle$，它按薛定谔方程演化：

$$
\begin{equation}
i\hbar \frac{d}{dt}|\Psi(t)\rangle = \hat{H}|\Psi(t)\rangle
\end{equation}
$$

$\hat{H}$ 是系统的哈密顿算符，对应总能量。对不含时的 $\hat{H}$，定态满足 $\hat{H}|\psi_n\rangle = E_n|\psi_n\rangle$。这些本征态构成一组完备基，$E_n$ 是系统可能的能量，谱可以是分立的。在这里，我们把系统处在某一个能量本征态 $|\psi_n\rangle$ 当作一个量子微观状态。

所以，无论用经典还是量子语言，力学都给出了孤立系统完整而确定的描述。问题恰恰出在这里。宏观系统的粒子数在 $10^{23}$ 量级，精确给出 $6N$ 个初始坐标和动量，或者一个多体波函数，在实践上做不到。而且我们关心的宏观量，比如压强或磁化强度，并不依赖某个特定微观状态的细节。大量不同的微观状态会给出几乎相同的宏观值。

这说明逐条追踪微观轨迹既做不到，也没有必要。我们需要换一个问题：在给定的宏观约束下，所有可能的微观状态是如何分布的。这就需要引入一个统计假设。

# 从力学到统计：等概率原理

既然无法知道系统具体处在哪个微观状态，我们就转而考虑所有满足宏观约束的微观状态构成的集合，称为**系综**。对能量 $E$、体积 $V$、粒子数 $N$ 都固定的孤立系统，系综由等能面上所有可能的微观状态组成，称为**微正则系综**。

此时有意义的问题是：平衡时，系统处在其中某个微观状态的概率是多少？力学本身回答不了这个问题，需要一个额外的假设，即统计力学的基本假设，也叫**等概率原理**：

> 处于平衡态的孤立系统，其所有可及的微观状态出现的概率相等。

这个原理不是从力学定律推出来的。它的合理性来自两点。第一，哈密顿演化保持相空间体积不变（刘维尔定理），动力学本身不偏好任何区域。第二，在对初始条件一无所知时，给能量相同的状态分配相同的概率是最不带偏见的选择，这也是最大熵原理的思路。任何不均匀的分布，都等于声称我们掌握了实际上并没有的信息。最终，这个假设是否正确，要看由它推出的理论能否与实验相符，而历史上它经受住了检验。

根据等概率原理，如果宏观态 $(E, V, N)$ 对应的微观状态总数为 $\Omega(E, V, N)$，那么其中任一微观状态 $i$ 的概率为：

$$
\begin{equation}
P_i = \frac{1}{\Omega(E, V, N)}
\end{equation}
$$

能量不等于 $E$ 的状态概率为零。$\Omega(E, V, N)$ 在经典情形下是等能面上的相空间体积，在量子情形下是能量 $E$ 的简并度。它衡量一个宏观态可以由多少种微观方式实现。

这一步把一个无法求解的动力学问题，变成了一个原则上可以处理的计数问题。我们不再需要求解 $10^{23}$ 个耦合的运动方程，只需计算与宏观态相容的微观状态数 $\Omega$。下一步是把 $\Omega$ 和一个可以测量的宏观量联系起来，这个量就是熵。

# 熵的统计定义与第二定律

我们希望找到一个只依赖 $\Omega$ 的函数 $S(N, V, E)$，并且它像宏观量一样是广延的：两个独立子系统合在一起时，总值等于两部分之和。

设系统 1 和系统 2 各自处于平衡态，宏观态分别为 $(N_1, V_1, E_1)$ 和 $(N_2, V_2, E_2)$，微观状态数分别为 $\Omega_1$ 和 $\Omega_2$。两者相互独立时，复合系统的每个微观状态都是系统 1 的一个状态和系统 2 的一个状态的组合，所以：

$$
\begin{equation}
\Omega_{total}(N_1+N_2, V_1+V_2, E_1+E_2) = \Omega_1(N_1, V_1, E_1) \times \Omega_2(N_2, V_2, E_2)
\end{equation}
$$

广延性要求 $S_{total} = S_1 + S_2$。也就是说，我们需要一个函数 $S = f(\Omega)$，把乘法变成加法：$f(\Omega_1 \Omega_2) = f(\Omega_1) + f(\Omega_2)$。满足这个条件的是对数函数。于是得到熵的统计定义，即**玻尔兹曼公式**：

$$
\begin{equation}
S \equiv k_B \ln \Omega(N, V, E)
\end{equation}
$$

玻尔兹曼常数 $k_B$ 的量纲是能量除以温度。取这个数值，是为了让统计熵与经典热力学中通过可逆过程定义的熵在数值上一致。

这个定义给了熵一个具体含义：熵是一个宏观态对应的微观实现方式数目的对数。熵越大，我们对系统具体处在哪个微观状态就越不确定。

热力学第二定律可以直接从这个定义推出。设想一个孤立系统内部有约束，比如箱子被隔板分成两半，气体全部在左边。此时的平衡态对应 $\Omega_{initial}$ 个微观状态。抽掉隔板后，原本不可达的相空间区域变得可达，系统开始向新的平衡态演化。按等概率原理，新的平衡态下所有可及状态概率相同，因此系统会落在包含微观状态最多的那个宏观态，比如气体均匀分布在整个箱子里。这个宏观态包含的状态数远远多于其他宏观态。

所以，孤立系统自发演化之后，末态的状态数不会少于初态，$\Omega_{final} \ge \Omega_{initial}$。代入熵的定义：

$$
\begin{equation}
\Delta S = S_{final} - S_{initial} = k_B (\ln \Omega_{final} - \ln \Omega_{initial}) \ge 0
\end{equation}
$$

这就是熵增原理。从统计的角度看，孤立系统的自发演化，就是从状态数较少的宏观态走向状态数多得多的宏观态。这种不可逆性来自概率上的压倒性差距，而不是微观力学定律本身的时间不对称。

# 热平衡与温度

接下来从统计出发定义温度。宏观上，温度用来判断热量流动的方向以及系统是否达到热平衡。所以我们要做的是：不预设温度，只从微观状态的统计推出热平衡条件，再看温度如何自然出现。

考虑一个孤立的复合系统，由子系统 1 和 2 组成。两者之间的隔板允许交换能量，但不交换粒子，也不改变体积。总能量 $E_{total}$ 固定。若系统 1 的能量为 $E_1$，则系统 2 的能量为 $E_2 = E_{total} - E_1$。在这个能量分配下，总熵为：

$$
\begin{equation}
S_{total}(E_1) = S_1(E_1) + S_2(E_{total} - E_1)
\end{equation}
$$

允许能量交换后，按第二定律，复合系统会走向总熵最大的状态。在热平衡时，$S_{total}$ 取极大值，对 $E_1$ 的一阶导数为零：

$$
\begin{equation}
\frac{\partial S_{total}}{\partial E_1} \bigg|_{\text{平衡}} = \frac{\partial S_1(E_1)}{\partial E_1} + \frac{\partial S_2(E_{total}-E_1)}{\partial E_1} = 0
\end{equation}
$$

由于 $E_2 = E_{total} - E_1$，有 $\frac{dE_2}{dE_1} = -1$，所以 $\frac{\partial S_2}{\partial E_1} = -\frac{\partial S_2}{\partial E_2}$。代入得到热平衡条件：

$$
\begin{equation}
\frac{\partial S_1(E_1)}{\partial E_1} = \frac{\partial S_2(E_2)}{\partial E_2}
\end{equation}
$$

也就是说，两个能交换能量的系统达到平衡时，熵对能量的偏导数相等。这正是温度应有的性质：平衡时处处相等的强度量。为了与热力学的习惯一致，定义：

$$
\begin{equation}
\frac{1}{T} \equiv \left(\frac{\partial S}{\partial E}\right)_{N,V}
\end{equation}
$$

有了这个定义，热平衡条件就是 $T_1 = T_2$。它还给出了热量流动的方向。若初始时 $T_1 > T_2$，则 $\frac{\partial S_1}{\partial E_1} < \frac{\partial S_2}{\partial E_2}$。要让总熵增加，能量应从导数较小的一方流向导数较大的一方，即 $dE_1 < 0$、$dE_2 > 0$。这正是热量从高温物体流向低温物体。

热力学**第零定律**（A 与 C 平衡、B 与 C 平衡，则 A 与 B 平衡）在这里就是等号的传递性：$T_A = T_C$ 且 $T_B = T_C$ 推出 $T_A = T_B$。

**第一定律**，即能量守恒，其实是整个推导的出发点：经典哈密顿量守恒，量子定态的能量确定。$\Delta U = Q + W$ 只是把非孤立系统的能量变化分成两类。功 $W$ 是通过改变外部参数（如体积）改变能级结构而传递的能量；热 $Q$ 是在能级结构不变时，通过改变各能级上的占据情况而传递的能量。

# 正则系综与配分函数

到目前为止，所有推导都基于孤立系统，也就是微正则系综。这在理论上是必要的起点，但用起来不方便。实验上很难让一个宏观系统的能量严格不变，而且直接计算等能面上的状态数 $\Omega$ 往往很复杂。

更常见的情形是系统与一个很大的热库接触。系统可以和热库交换能量，所以它的能量在某个平均值附近涨落。这时描述系统的宏观变量是 $(N, V, T)$，温度由热库决定。对应的系综称为**正则系综**。

问题是：小系统 S 与大热库 R 达到平衡时，S 处于能量为 $E_i$ 的某个微观状态 $i$ 的概率是多少？把 S 和 R 合起来看作一个总能量为 $E_{total}$ 的孤立系统，就可以对整体使用等概率原理。S 处于状态 $i$ 的概率，正比于此时整个系统可以处在的微观状态数，也就是热库在能量 $E_{total} - E_i$ 下的状态数：

$$
\begin{equation}
P_i \propto \Omega_R(E_{total} - E_i)
\end{equation}
$$

热库远大于系统，$E_i \ll E_{total}$。把热库的熵 $S_R = k_B \ln \Omega_R$ 在 $E_{total}$ 附近展开：

$$
\begin{equation}
S_R(E_{total} - E_i) \approx S_R(E_{total}) - \left(\frac{\partial S_R}{\partial E_R}\right)_{E_{total}} E_i + \dots
\end{equation}
$$

根据上一节的定义，一阶导数就是热库温度的倒数 $1/T$：

$$
\begin{equation}
k_B \ln \Omega_R(E_{total} - E_i) \approx S_R(E_{total}) - \frac{E_i}{T}
\end{equation}
$$

两边取指数，得到 $\Omega_R(E_{total} - E_i) \propto \exp(-E_i/k_B T)$。所以系统处于能量 $E_i$ 的状态的概率正比于**玻尔兹曼因子** $e^{-E_i/k_B T}$。

为了让概率归一，引入**配分函数**：

$$
\begin{equation}
Z(N, V, T) \equiv \sum_{j} e^{-E_j/k_B T}
\end{equation}
$$

求和遍历系统 S 的所有微观状态。于是：

$$
\begin{equation}
P_i = \frac{e^{-E_i/k_B T}}{Z}
\end{equation}
$$

这就是正则分布。配分函数不只是归一化常数。它把微观能级 $E_j$ 和宏观热力学量联系起来，系统的全部热力学信息都包含在 $Z$ 中。连接两者的是**亥姆霍兹自由能**：

$$
\begin{equation}
F(N, V, T) = -k_B T \ln Z(N, V, T)
\end{equation}
$$

由微观能谱算出 $Z$，就得到 $F$。知道 $F$ 关于 $(N, V, T)$ 的函数形式后，其余热力学量都可以通过求导得到，例如熵 $S = -(\frac{\partial F}{\partial T})_{N,V}$，压强 $P = -(\frac{\partial F}{\partial V})_{N,T}$，内能 $U = F + TS$。

# 量子统计：全同粒子与巨正则系综

最后要把量子力学中**全同粒子**的性质纳入统计。若把粒子当作可分辨的，$N$ 个近独立粒子的配分函数近似为单粒子配分函数 $Z_1 = \sum_i e^{-\beta \epsilon_i}$ 的 $N$ 次方，再除以 $N!$ 来粗略修正不可分辨性：$Z_N \approx (Z_1)^N / N!$。这个处理只在高温、低密度的经典极限下成立。一般情形需要直接从多体波函数的对称性出发，而这会改变微观状态的计数方式。

在粒子数 $N$ 固定的正则系综里处理这种对称性约束比较麻烦。更方便的做法是改用**巨正则系综**：系统同时与热库和粒子库接触，宏观状态由温度 $T$、体积 $V$ 和化学势 $\mu$ 决定，粒子数和能量都可以涨落。巨配分函数对所有粒子数 $N$ 及对应的微观状态 $i$ 求和：

$$
\begin{equation}
\mathcal{Z}(T, V, \mu) = \sum_{N=0}^{\infty} \sum_{i(N)} e^{-\beta(E_{i(N)} - \mu N)}
\end{equation}
$$

其中 $\beta = 1/k_B T$。在量子力学中，多粒子系统的微观状态可以用一组**占据数** $\{n_k\}$ 来指定，$n_k$ 是处在能量为 $\epsilon_k$ 的单粒子态上的粒子数。总粒子数 $N = \sum_k n_k$，总能量 $E = \sum_k n_k \epsilon_k$。代入后，求和变成对所有占据数分布求和：

$$
\begin{equation}
\mathcal{Z} = \sum_{\{n_k\}} e^{-\beta \sum_k (n_k \epsilon_k - \mu n_k)} = \sum_{\{n_k\}} \prod_k \left[e^{-\beta(\epsilon_k - \mu)}\right]^{n_k}
\end{equation}
$$

由于求和遍历所有占据数组合，而被求和项是各个 $k$ 的乘积，可以交换求和与求积：

$$
\begin{equation}
\mathcal{Z} = \prod_k \left( \sum_{n_k} \left[e^{-\beta(\epsilon_k - \mu)}\right]^{n_k} \right)
\end{equation}
$$

巨配分函数分解成了每个单粒子态各自贡献的乘积。粒子的量子统计性质就体现在 $n_k$ 能取哪些值上。

对**费米子**，泡利不相容原理要求每个单粒子态最多有一个粒子，$n_k \in \{0, 1\}$，括号内只有两项：

$$
\begin{equation}
\sum_{n_k=0}^{1} \left[e^{-\beta(\epsilon_k - \mu)}\right]^{n_k} = 1 + e^{-\beta(\epsilon_k - \mu)}
\end{equation}
$$

对**玻色子**，任意多个粒子可以占据同一个态，$n_k = 0, 1, 2, \dots$，括号内是几何级数：

$$
\begin{equation}
\sum_{n_k=0}^{\infty} \left[e^{-\beta(\epsilon_k - \mu)}\right]^{n_k} = \frac{1}{1 - e^{-\beta(\epsilon_k - \mu)}}
\end{equation}
$$

我们更关心的是能级 $\epsilon_k$ 上的平均粒子数，它可以由巨配分函数求导得到：$\langle n_k \rangle = -\frac{1}{\beta}\frac{\partial \ln \mathcal{Z}}{\partial \epsilon_k}$。分别代入两种情况，得到费米子的**费米-狄拉克分布**：

$$
\begin{equation}
\langle n_k \rangle_{FD} = \frac{1}{e^{\beta(\epsilon_k - \mu)} + 1}
\end{equation}
$$

和玻色子的**玻色-爱因斯坦分布**：

$$
\begin{equation}
\langle n_k \rangle_{BE} = \frac{1}{e^{\beta(\epsilon_k - \mu)} - 1}
\end{equation}
$$

到这里，我们从力学、等概率原理和全同粒子的对称性出发，推出了熵、温度、正则分布，以及两种量子统计分布。金属中的电子气、黑体辐射等问题，都可以在这个框架下展开计算。

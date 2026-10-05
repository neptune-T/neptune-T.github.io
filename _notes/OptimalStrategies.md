---
title: 'From the Law of Large Numbers to Optimal Strategies: Proving Upper and Lower Bounds in Stochastic Processes'
date: '2026-01'
summary: 'By applying concentration inequalities like Hoeffding’s, we derive deterministic bounds for uncertain processes, providing the foundation for UCB and TD learning. '
tags: ['Reinforcement learning','Probability Bounds']
---

![](https://raw.githubusercontent.com/neptune-t/aca-web-html/main/public/img/Theory/bounds.png)

> The essence of reinforcement learning is to hunt down an uncertain stochastic process with deterministic mathematical bounds. All our efforts are to make these bounds ever tighter.

> “Chance is only the measure of our ignorance.” — Henri Poincaré

这篇笔记想回答一个问题：在随机环境里做序列决策，什么时候能给出确定的保证？如果环境模型已知，贝尔曼算子是一个压缩映射，价值迭代一定收敛。环境未知时，我们只能用有限样本估计期望，这时需要集中不等式告诉我们估计离真值有多远。沿着这条线，可以从 MDP 一路推到 UCB 和时序差分学习。

# The mechanical foundation of sequential decision-making: MDP (Markov Decision Process)

先把决策问题形式化。设状态空间为 $\mathcal{S}$，动作空间为 $\mathcal{A}$。在时刻 $t$，系统状态为 $S_t \in \mathcal{S}$，智能体选择动作 $A_t \in \mathcal{A}$。系统按转移核 $P(s' \mid s, a)$ 演化，它给出在状态 $s$ 执行动作 $a$ 后，下一个状态的概率分布。

马尔可夫决策过程（MDP）依赖马尔可夫性：未来只取决于当前状态和动作，与更早的历史无关：

$$
\begin{equation}
    \mathbb{P}(S_{t+1} \mid S_t, A_t, \dots, S_0, A_0) = \mathbb{P}(S_{t+1} \mid S_t, A_t)
\end{equation}
$$

也就是说，$S_t$ 是预测未来所需的充分统计量。没有这个性质，决策就要在整条历史轨迹上做优化；有了它，问题可以写成状态空间上的递推。

为了衡量好坏，引入奖励 $R(s, a)$。我们关心的不是单步奖励，而是累积回报的期望，即价值函数 $V^\pi(s)$。为了让无穷求和收敛，引入折扣因子 $\gamma \in [0, 1)$。它既保证了数学上的收敛，也表示智能体对远期奖励的重视程度。

## 贝尔曼方程

确定 MDP 之后，目标是找到最优策略 $\pi^*$，使从任意状态出发的期望回报最大。由全期望公式，价值函数满足递推关系，即贝尔曼期望方程：

$$
\begin{equation}
    V^\pi(s) = \sum_{a \in \mathcal{A}} \pi(a|s) \left[ R(s, a) + \gamma \sum_{s' \in \mathcal{S}} P(s' \mid s, a) V^\pi(s') \right]
\end{equation}
$$

这个方程把对无穷长轨迹的求和，变成了一步之内的关系。把右边看成作用在价值函数上的算子 $\mathcal{T}^\pi: \mathbb{R}^{|\mathcal{S}|} \to \mathbb{R}^{|\mathcal{S}|}$，那么 $V^\pi$ 就是这个算子的不动点。

# Complete Metric Spaces and Bellman Operators

记 $\mathcal{V}$ 为定义在 $\mathcal{S}$ 上的所有有界实值函数。用无穷范数衡量两个价值估计之间的距离：

$$
\begin{equation}
    d(V, U) = \|V - U\|_\infty = \max_{s \in \mathcal{S}} |V(s) - U(s)|
\end{equation}
$$

$(\mathcal{V}, \|\cdot\|_\infty)$ 是一个巴拿赫空间，即完备的赋范向量空间：其中的柯西序列一定收敛到空间内的某个元素。后面证明收敛时要用到这一点。在这个空间上定义最优贝尔曼算子 $\mathcal{T}^*: \mathcal{V} \to \mathcal{V}$：

$$
\begin{equation}
    (\mathcal{T}^* V)(s) = \max_{a \in \mathcal{A}} \left[ R(s, a) + \gamma \sum_{s' \in \mathcal{S}} P(s' \mid s, a) V(s') \right]
\end{equation}
$$

## 压缩映射

要证明反复应用 $\mathcal{T}^*$ 会收敛，需要证明它是压缩映射，即对任意 $V, U \in \mathcal{V}$：

$$
\begin{equation}
    \|\mathcal{T}^* V - \mathcal{T}^* U\|_\infty \le \gamma \|V - U\|_\infty, \quad \gamma < 1
\end{equation}
$$

证明：任取状态 $s$，不妨设 $(\mathcal{T}^* V)(s) \ge (\mathcal{T}^* U)(s)$。令 $a^*$ 为使 $V$ 在 $s$ 处取到最大值的动作，$a^* = \arg\max_a [R_{s,a} + \gamma \mathbb{E}[V'] ]$。由于第二项的最大值不小于它在 $a^*$ 处的取值：

$$
\begin{equation}
    \begin{aligned}
        (\mathcal{T}^* V)(s) - (\mathcal{T}^* U)(s) &= \max_a [R_{s,a} + \gamma \mathbb{E}[V'] ] - \max_a [R_{s,a} + \gamma \mathbb{E}[U'] ] \\
        &\le [R_{s,a^*} + \gamma \mathbb{E}[V'] ] - [R_{s,a^*} + \gamma \mathbb{E}[U'] ] \\
        &= \gamma \sum_{s' \in \mathcal{S}} P(s' \mid s, a^*) (V(s') - U(s')) \\
        &\le \gamma \sum_{s' \in \mathcal{S}} P(s' \mid s, a^*) |V(s') - U(s')| \\
        &\le \gamma \sum_{s' \in \mathcal{S}} P(s' \mid s, a^*) \|V - U\|_\infty \\
        &= \gamma \|V - U\|_\infty
    \end{aligned}
\end{equation}
$$

这对所有状态都成立，所以 $\|\mathcal{T}^* V - \mathcal{T}^* U\|_\infty \le \gamma \|V - U\|_\infty$，$\mathcal{T}^*$ 是系数为 $\gamma$ 的压缩映射。同样的论证（去掉 $\max$）说明 $\mathcal{T}^\pi$ 也是压缩映射。

由巴拿赫不动点定理，压缩映射在完备空间中有唯一不动点，而且从任意初值 $V_0$ 出发反复应用算子，误差按 $\gamma^k$ 指数收敛到这个不动点。对 $\mathcal{T}^\pi$，不动点是 $V^\pi$；对 $\mathcal{T}^*$，不动点是最优价值 $V^*$。所以，求最优价值的问题变成了求算子不动点的问题。只要能精确计算 $\mathcal{T}^*$，剩下的就只是迭代次数。

## 从精确算子到采样估计

问题在于，强化学习中转移核 $P$ 和奖励分布 $R$ 通常未知，我们没法精确计算算子里的期望，只能依靠交互得到的轨迹 $\tau = \{s_0, a_0, r_1, s_1, \dots\}$。价值估计 $\hat{V}(s)$ 于是变成了回报 $G_t$ 的经验均值。大数定律保证样本数趋于无穷时它收敛到真实期望，但在有限样本下，它会有波动。

这就引出下一个问题：给定有限样本，$\hat{V}(s)$ 离真实值有多远？如果误差大，基于它做的策略改进可能把我们带偏。回答这个问题需要集中不等式。我们关心的不再只是"是否收敛"，而是"以多快的速度、以多大的概率落在某个误差范围内"。下面从马尔可夫不等式、切比雪夫不等式一直推到霍夫丁不等式。

# From rectangular scaling to Chebyshev

我们观测不到算子里的期望 $\mathbb{E}$，只能观测到经验均值 $\hat{\mu}_n$。集中不等式给出尾部概率的上界：样本量为 $n$ 时，估计值偏离真实值超过 $\epsilon$ 的概率最多是多少。我们从只用一阶矩的最粗糙的界开始。

## 马尔可夫不等式：只用均值

如果只知道随机变量的均值，对它的波动能说什么？对非负随机变量 $X \ge 0$ 和任意 $a > 0$：

$$
\begin{equation}
    \mathbb{P}(X \ge a) \le \frac{\mathbb{E}[X]}{a}
\end{equation}
$$

证明：考虑指示函数 $\mathbb{I}_{X \ge a}$。当 $X \ge a$ 时，$\frac{X}{a} \ge 1 = \mathbb{I}_{X \ge a}$；当 $X < a$ 时，$\frac{X}{a} \ge 0 = \mathbb{I}_{X \ge a}$。所以总有 $\mathbb{I}_{X \ge a} \le \frac{X}{a}$。两边取期望：

$$
\begin{equation}
    \mathbb{E}[\mathbb{I}_{X \ge a}] \le \mathbb{E}\left[\frac{X}{a}\right] \implies \mathbb{P}(X \ge a) \le \frac{\mathbb{E}[X]}{a}
\end{equation}
$$

这个界很松，尾部概率只按 $1/a$ 衰减。放在强化学习里，只知道平均奖励，几乎无法排除偶尔出现极端坏结果的可能。但后面所有更紧的界，都是在它的基础上用更多矩信息得到的。

## 切比雪夫不等式：加入方差

如果还知道方差 $\sigma^2$，可以得到更紧的界。对任意随机变量 $X$（不要求非负），若期望为 $\mu$、方差为 $\sigma^2$，则对任意 $\epsilon > 0$：

$$
\begin{equation}
    \mathbb{P}(|X - \mu| \ge \epsilon) \le \frac{\sigma^2}{\epsilon^2}
\end{equation}
$$

证明：事件 $\{|X - \mu| \ge \epsilon\}$ 等价于 $(X - \mu)^2 \ge \epsilon^2$。$(X - \mu)^2$ 非负，对它用马尔可夫不等式：

$$
\begin{equation}
    \mathbb{P}((X - \mu)^2 \ge \epsilon^2) \le \frac{\mathbb{E}[(X - \mu)^2]}{\epsilon^2}
\end{equation}
$$

由方差的定义 $\mathbb{E}[(X - \mu)^2] = \sigma^2$，得证：

$$
\begin{equation}
    \mathbb{P}(|X - \mu| \ge \epsilon) \le \frac{\sigma^2}{\epsilon^2}
\end{equation}
$$

尾部概率现在按 $1/\epsilon^2$ 衰减。如果能估计回报的方差，就可以给价值估计一个初步的置信区间。

但这仍然不够快。对 $n$ 个独立样本的均值 $\bar{X}_n$，切比雪夫给出的界是 $\frac{\sigma^2}{n\epsilon^2}$，只随 $n$ 线性下降。对有界变量，真实的尾部概率下降得快得多。

下一步的想法是利用所有阶矩的信息，也就是通过矩生成函数 $M_X(t) = \mathbb{E}[e^{tX}]$ 来放缩。把随机变量放进指数里再用马尔可夫不等式，得到的界会随样本数指数下降。

# Hoeffding's inequality

像"需要多少样本才能以 99% 的把握判断一个动作是次优的"这类问题，按 $1/n$ 收敛太慢了。强化学习中奖励通常有界（如 $r \in [0, 1]$），有界性是比"方差有限"更强的条件，可以用来得到指数级的界。

设 $X_1, X_2, \dots, X_n$ 独立，$X_i \in [a_i, b_i]$，均值为 $\mu_i$。我们要估计 $\mathbb{P}(\sum X_i - \sum \mu_i \ge t)$ 的上界。

## 切尔诺夫方法

很自然的想法是直接用马尔可夫不等式：

$$
    \mathbb{P}(Z \ge a) \le \frac{\mathbb{E}[Z]}{a}
$$

但马尔可夫不等式要求变量非负，而偏差 $X_i - \mu_i$ 有正有负。如果硬套，会得到：

$$
    \mathbb{E}[\sum (X_i - \mu_i)] = \sum (\mathbb{E}[X_i] - \mu_i) = \sum (\mu_i - \mu_i) = 0
$$

$$
    \mathbb{P}(\dots \ge t) \le \frac{0}{t} = 0
$$

这显然是错的。解决办法是先套一个单调递增的指数函数。这样变量变成非负的，而且较大的偏差会被放大：

$$
\begin{equation}
    \mathbb{P}\left(\sum (X_i - \mu_i) \ge t\right) = \mathbb{P}\left(e^{s \sum (X_i - \mu_i)} \ge e^{st}\right)
\end{equation}
$$

再用马尔可夫不等式：

$$
\begin{equation}
    \mathbb{P}\left(\sum (X_i - \mu_i) \ge t\right) \le e^{-st} \mathbb{E}\left[e^{s \sum (X_i - \mu_i)}\right]
\end{equation}
$$

由独立性，和的指数的期望等于各项期望的乘积：

$$
\begin{equation}
    \mathbb{P}(\dots) \le e^{-st} \prod_{i=1}^n \mathbb{E}\left[e^{s(X_i - \mu_i)}\right]
\end{equation}
$$

对单个变量写出来，就是切尔诺夫界的一般形式：

$$
\begin{equation}
\mathbb{P}(X \ge \epsilon) = \mathbb{P}(e^{sX} \ge e^{s\epsilon}) \le \frac{\mathbb{E}[e^{sX}]}{e^{s\epsilon}} = e^{-s\epsilon} M_X(s)
\end{equation}
$$

其中 $M_X(s) = \mathbb{E}[e^{sX}]$ 是矩生成函数。这个方法引入了一个自由参数 $s$，最后可以对 $s$ 优化，取最紧的界。

## 霍夫丁引理

要继续推下去，需要给 $M_X(s)$ 一个上界。一般分布很难做到，但对有界变量，霍夫丁引理给出了一个简洁的结果。

**引理**：设 $X$ 均值为 0，且 $X \in [a, b]$。对任意 $s \in \mathbb{R}$：

$$
\begin{equation}
    \mathbb{E}[e^{sX}] \le e^{\frac{s^2(b-a)^2}{8}}
\end{equation}
$$

证明思路是利用指数函数的凸性。任意 $x \in [a, b]$ 都可以写成 $a$ 和 $b$ 的凸组合：

$$
\begin{equation}
    x = \frac{b-x}{b-a}a + \frac{x-a}{b-a}b
\end{equation}
$$

由 $e^{sx}$ 的凸性：

$$
\begin{equation}
    e^{sx} \le \frac{b-x}{b-a}e^{sa} + \frac{x-a}{b-a}e^{sb}
\end{equation}
$$

两边取期望，并利用 $\mathbb{E}[X]=0$：

$$
\begin{equation}
    \mathbb{E}[e^{sX}] \le \frac{b}{b-a}e^{sa} - \frac{a}{b-a}e^{sb}
\end{equation}
$$

引入两个辅助变量。令 $p = \frac{-a}{b-a}$。由于 $\mathbb{E}[X]=0$，必有 $a \le 0 \le b$，所以 $p \in [0, 1]$，且 $1-p = \frac{b}{b-a}$。再令 $u = s(b-a)$。

不等式右边可以写成 $u$ 的函数：

$$
\begin{equation}
    \phi(u) = (1-p)e^{-pu} + pe^{(1-p)u}
\end{equation}
$$

目标是证明 $\phi(u) \le e^{u^2/8}$。定义 $L(u) = \ln \phi(u)$，只需证明 $L(u) \le \frac{u^2}{8}$。

$$
\begin{equation}
    L(u) = \ln \left( (1-p)e^{-pu} + pe^{(1-p)u} \right)
\end{equation}
$$

提出 $e^{-pu}$：

$$
\begin{equation}
    L(u) = -pu + \ln \left( 1 - p + pe^u \right)
\end{equation}
$$

在 $u=0$ 处做泰勒展开。一阶导数：

$$
\begin{equation}
    L'(u) = -p + \frac{pe^u}{1 - p + pe^u}
\end{equation}
$$

代入 $u=0$ 得 $L'(0) = -p + p = 0$。

二阶导数：令 $q(u) = \frac{pe^u}{1 - p + pe^u}$，则 $L'(u) = -p + q(u)$，

$$
\begin{equation}
    L''(u) = q'(u) = \frac{p e^u (1-p+pe^u) - (pe^u)^2}{(1-p+pe^u)^2} = \frac{pe^u(1-p)}{(1-p+pe^u)^2}
\end{equation}
$$

可以看出 $L''(u) = q(u)(1-q(u))$。

由带拉格朗日余项的泰勒公式，存在介于 $0$ 和 $u$ 之间的 $\xi$，使得：

$$
\begin{equation}
    L(u) = L(0) + L'(0)u + \frac{1}{2} L''(\xi)u^2
\end{equation}
$$

已知 $L(0) = \ln(1-p+p) = 0$，$L'(0) = 0$。函数 $z(1-z)$ 的最大值是 $\frac{1}{4}$（在 $z = 1/2$ 处取到），而 $q(\xi) \in (0, 1)$，所以：

$$
\begin{equation}
    L''(\xi) = q(\xi)(1-q(\xi)) \le \frac{1}{4}
\end{equation}
$$

代回泰勒展开：

$$
\begin{equation}
    L(u) \le 0 + 0 + \frac{1}{2} \cdot \frac{1}{4} \cdot u^2 = \frac{u^2}{8}
\end{equation}
$$

把 $u = s(b-a)$ 代回：

$$
\begin{equation}
    \ln(\mathbb{E}[e^{sX}]) \le L(s(b-a)) \le \frac{s^2(b-a)^2}{8}
\end{equation}
$$

两边取指数，就是霍夫丁引理：

$$
\begin{equation}
    \mathbb{E}[e^{sX}] \le \exp\left( \frac{s^2(b-a)^2}{8} \right)
\end{equation}
$$

右边恰好是方差为 $\frac{(b-a)^2}{4}$ 的正态分布的矩生成函数。也就是说，任何取值在 $[a, b]$ 内、均值为 0 的变量，其矩生成函数都不超过一个方差为 $\frac{(b-a)^2}{4}$ 的高斯变量的矩生成函数，这类变量称为次高斯的。系数 $1/8$ 来自两部分：泰勒展开二阶项的 $1/2$，以及 $z(1-z)$ 的最大值 $1/4$。

## 霍夫丁不等式

把霍夫丁引理代入切尔诺夫界。设 $X_1, \dots, X_n$ 独立同分布，均值为 $\mu$，取值范围为 $[a, b]$，经验均值为 $\bar{X}_n = \frac{1}{n} \sum X_i$。对 $s$ 求导取最优值 $s = \frac{4n\epsilon}{(b-a)^2}$，得到霍夫丁不等式：

$$
\begin{equation}
\mathbb{P}(\bar{X}_n - \mu \ge \epsilon) \le \exp\left( - \frac{2n\epsilon^2}{(b-a)^2} \right)
\end{equation}
$$

这个结果有两个直接的推论。

第一，误差概率随样本数 $n$ 指数下降。想让出错概率再降低 10 倍，只需要额外增加约 $\frac{(b-a)^2 \ln 10}{2\epsilon^2}$ 个样本，而不是把样本数乘以 10。

第二，可以反过来求置信区间。取 $[a, b] = [0, 1]$，令出错概率为 $\delta$，即 $\exp(-2n\epsilon^2) = \delta$，解出误差：

$$
\begin{equation}
    \epsilon = \sqrt{\frac{\ln(1/\delta)}{2n}}
\end{equation}
$$

也就是说，以至少 $1-\delta$ 的概率，估计误差小于 $\epsilon$。UCB 算法里的探索项 $\sqrt{\ln t / n}$ 就是从这里来的。

# Mathematical derivation of the UCB algorithm

有了霍夫丁不等式，就可以定量处理探索与利用（Exploration vs. Exploitation）的问题。如果只用贪心策略，智能体可能一直选当前估计最好的动作，而从未充分尝试真正更好的动作。

下面以多臂老虎机（Multi-Armed Bandit, MAB）为例，说明霍夫丁不等式如何给出 UCB（Upper Confidence Bound）算法。

## Optimism in the Face of Uncertainty

UCB 的原则是"面对不确定性保持乐观"。一个动作的真实期望 $\mu_a$ 可能高于当前估计 $\hat{\mu}_a$，样本越少，这种可能越大。所以给每个动作的估计加上一个与不确定性相关的补偿项 $U_t(a)$，使得真实价值以很高的概率满足：

$$
\begin{equation}
    \mu_a \le \hat{\mu}_a(t) + U_t(a)
\end{equation}
$$

然后每一步选择这个置信上限最高的动作。

## 从霍夫丁不等式推出 UCB

设动作 $a$ 在时刻 $t$ 之前被选了 $N_t(a)$ 次，奖励在 $[0, 1]$ 内。由霍夫丁不等式：

$$
\mathbb{P}\left( \mu_a \ge \hat{\mu}_a(t) + \epsilon_t \right) \le \exp\left( -2 N_t(a) \epsilon_t^2 \right)
$$

令 $\delta_t$ 为允许出错的概率，即真实均值超出上限的概率：

$$
\begin{equation}
    \exp\left( -2 N_t(a) \epsilon_t^2 \right) = \delta_t
\end{equation}
$$

取对数解出 $\epsilon_t$：

$$
\begin{equation}
    -2 N_t(a) \epsilon_t^2 = \ln(\delta_t) \implies \epsilon_t = \sqrt{\frac{-\ln(\delta_t)}{2 N_t(a)}}
\end{equation}
$$

随着步数 $t$ 增加，我们希望出错概率越来越小，所以让 $\delta_t$ 随时间衰减。UCB1 取 $\delta_t = t^{-4}$，这样可以保证累积遗憾（regret）按 $\ln t$ 增长。代入：

$$
\begin{equation}
    \epsilon_t = \sqrt{\frac{-\ln(t^{-4})}{2 N_t(a)}} = \sqrt{\frac{4 \ln t}{2 N_t(a)}} = \sqrt{\frac{2 \ln t}{N_t(a)}}
\end{equation}
$$

于是得到 UCB 的选择规则：

$$
\begin{equation}
A_t = \arg\max_{a \in \mathcal{A}} \left[ \hat{Q}_t(a) + c \sqrt{\frac{\ln t}{N_t(a)}} \right]
\end{equation}
$$

其中 $c = \sqrt{2}$ 对应上面的推导。实践中常把 $c$ 当作超参数调节探索的强度。

# Temporal difference learning and the bootstrapping principle

霍夫丁不等式给样本均值划定了置信范围。但蒙特卡罗（MC）方法有一个结构上的问题：它要用完整轨迹的回报 $G_t$。在长序列任务中，$G_t$ 是很多随机奖励 $R_{t+k}$ 的加权和，方差随轨迹长度累积，收敛很慢。

要绕开这一点，需要回到贝尔曼方程的递推结构。MC 是对整条路径求平均，而时序差分（Temporal Difference, TD）学习每一步只看一次转移，用下一状态的估计值来更新当前状态。

## 自举与 TD 误差

TD 的核心是自举（bootstrapping）：用后续状态的估计值更新当前状态的估计值。它直接来自贝尔曼期望方程：

$$
    V^\pi(s) = \mathbb{E}_\pi [R_{t+1} + \gamma V^\pi(S_{t+1}) \mid S_t = s]
$$

在无模型的设定下，我们无法计算这个期望，但每次真实转移 $(S_t, A_t, R_{t+1}, S_{t+1})$ 都提供了一个样本。用它构造 TD 目标 $G_t^{TD} = R_{t+1} + \gamma V(S_{t+1})$。注意这里的 $V(S_{t+1})$ 是当前估计，不是真值。

TD 误差 $\delta_t$ 是 TD 目标与当前估计的差：

$$
\begin{equation}
    \delta_t = R_{t+1} + \gamma V(S_{t+1}) - V(S_t)
\end{equation}
$$

按随机逼近（stochastic approximation）的思路更新：

$$
\begin{equation}
    V(S_t) \leftarrow V(S_t) + \alpha \delta_t
\end{equation}
$$

$\alpha$ 是学习率。需要注意，这并不是对贝尔曼残差 $\delta_t^2$ 的真正梯度下降：更新时把目标里的 $V(S_{t+1})$ 当成常数，不对它求导，所以通常称为半梯度（semi-gradient）方法。与 MC 不同，TD 不需要等到回合结束，每走一步就能更新。

## 偏差与方差

自举改变了估计量的性质，这就是强化学习中常说的偏差-方差权衡。MC 的目标 $G_t = \sum \gamma^k R_{t+k+1}$ 是 $V^\pi(s)$ 的无偏估计，但它受整条路径上所有随机转移和奖励的影响，方差很大，有限样本下收敛慢。

TD 目标 $R_{t+1} + \gamma V(S_{t+1})$ 的特点正好相反：

- 方差低：它只受一步随机性（$R_{t+1}$ 和 $S_{t+1}$）的影响，后续的波动被估计值 $V(S_{t+1})$ 吸收了。
- 有偏：学习初期 $V(S_{t+1})$ 往往离真值很远，TD 目标并不是真实期望的无偏估计。随着价值函数逐渐收敛，这个偏差才会消失。

换句话说，TD 用一部分偏差换来了方差的大幅下降。这解释了为什么实践中 TD 方法通常比 MC 有更好的样本效率。

## 收敛性

对有限状态 MDP，在学习率满足常规条件时，表格型 TD(0) 以概率 1 收敛到 $V^\pi$。分析通常用 ODE 方法：把随机更新看作一个常微分方程的离散近似，而这个 ODE 的平衡点就是贝尔曼方程的解。

在固定的一批数据上反复做 TD(0) 更新（batch TD），结果会收敛到确定性等价（certainty-equivalence）估计：先用数据估计出最大似然的 MDP 模型（转移概率和奖励），再精确求解这个模型下的价值函数。批量 MC 则收敛到使训练回报均方误差最小的估计。这是两者在同样数据上给出不同答案的原因。

## 从单步到多步

TD(0) 只看一步，MC 看到回合结束，两者之间是 n 步时序差分（n-step TD）：

$$
\begin{equation}
    G_{t:t+n} = R_{t+1} + \gamma R_{t+2} + \dots + \gamma^{n-1} R_{t+n} + \gamma^n V(S_{t+n})
\end{equation}
$$

$n$ 越大，自举带来的偏差越小，采样带来的方差越大。TD($\lambda$) 用指数加权把所有步长的目标组合在一起，在两者之间连续调节。

回头看整条线：模型已知时，贝尔曼算子的压缩性保证价值迭代收敛；模型未知时，集中不等式告诉我们有限样本的估计能有多准，UCB 用它来指导探索，TD 则用自举在偏差和方差之间取舍。

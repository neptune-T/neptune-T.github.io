---
title: 'How Robots Learned to See, Understand, and Act'
date: '2026-06'
summary: 'Vision-Language-Action models are transforming robot learning from a collection of task-specific controllers into general-purpose embodied agents.  Rather than treating VLA as a single model architecture, we examine it as a sequence of responses to increasingly difficult questions: how robots understand tasks, how semantic knowledge becomes continuous action, how policies operate over long horizons, and how they improve beyond static demonstrations.'
tags: ['Robot Learning','Probability Bounds','Generative Policy']
---


`Intelligent behavior emerges through feedback between an agent and its environment.`

## 任务特定策略 -> 语言模型

机器人学习最初通常将每一种操作能力视为一个独立的控制问题。对于抓取、放置、开门或导航等任务，研究者分别定义任务状态、控制目标和训练数据，并针对特定场景学习对应策略。给定当前观测 ($o_t$)，策略预测机器人下一步动作：

$$
\begin{equation}
a_t = \pi_\theta(o_t).
\end{equation}
$$

在这一范式下，任务目标通常隐含在策略本身。一个为抓取训练的策略只负责抓取，一个为开门训练的策略只负责开门。策略并不需要显式理解“当前应该完成什么任务”，因为任务在训练阶段已经固定。

这种任务特定的建模方式使控制问题相对简单。模型只需要拟合有限环境中的状态到动作映射，研究者也可以针对任务特点单独设计观测表示、动作空间和奖励函数。然而，它的扩展性受到根本限制。每增加一种任务、物体类别或机器人平台，通常都需要重新采集数据并训练新的策略。不同任务之间虽然可能共享相似的视觉和运动模式，但这些能力被分别封装在独立模型中，难以形成统一、可复用的机器人能力。

这一问题促使机器人学习从单任务策略转向多任务策略。多任务策略在同一个模型中引入额外的任务条件 ($z$)：

$$
\begin{equation}
a_t = \pi_\theta(o_t, z).
\end{equation}
$$

其中，($z$) 可以是任务编号、目标类别、目标位置或预定义的技能编码。通过加入任务条件，同一个策略可以根据不同输入执行多个行为。例如，模型可以使用不同任务编号区分抓取、放置和开门，也可以根据目标类别决定需要操作的物体。

多任务学习统一了模型参数，但没有真正统一任务语义。离散任务编号只能告诉模型当前需要调用哪一种已知行为，却无法描述任务之间的关系。对于模型而言，“抓取杯子”和“抓取盘子”可能只是两个无关编号；当出现一个未见过的任务编号时，模型无法根据已有经验推断它与已知任务之间的相似性。


随着大语言模型的发展，研究者发现，语言模型的能力并不局限于生成和理解文本。通过在大规模互联网数据上进行预训练，大语言模型能够学习任务之间的语义关系，并表现出一定程度的知识迁移、任务分解和推理能力。给定一个自然语言指令，模型不仅能够识别指令中涉及的对象和动作，还能够根据已有知识推断完成任务所需的中间步骤。

例如，对于“将桌上的杯子放进水槽”这一任务，语言模型可以从高层语义上将其分解为寻找杯子、接近杯子、抓取杯子、移动到水槽附近以及释放杯子等多个阶段。虽然语言模型本身无法直接控制机器人，但这种能力说明，复杂任务不一定需要被预先编码为固定的任务编号或有限状态机，而可以通过自然语言进行统一描述和推理。

与此同时，视觉语言模型将语言模型的能力进一步扩展到了视觉场景。通过在大规模图像—文本数据上进行联合训练，视觉语言模型能够建立图像区域与语言概念之间的对应关系，并根据自然语言理解图像中的对象、属性、空间关系和场景语义。

给定图像 ($I_t$) 和语言指令 ($l$)，视觉语言模型可以学习：

$$
\begin{equation}
p(y \mid I_t, l),
\end{equation}
$$

其中 ($y$) 可以是文本回答、对象描述、空间关系或任务相关的语义判断。

这意味着，模型不再只是理解“杯子”这一抽象语言概念，还能够在当前视觉场景中识别具体的杯子，并判断它与桌面、水槽及其他物体之间的空间关系。语言模型提供的任务知识和推理能力，由此开始与视觉感知能力结合。

这一进展为机器人学习提供了一条新的技术路径。传统机器人策略通常需要依赖专门采集的机器人数据，从有限示范中同时学习物体识别、任务理解和动作控制。相比之下，视觉语言模型已经通过互联网规模的数据学习了大量关于物体、场景和人类任务的知识。研究者因此开始思考，是否可以利用这种预训练知识，减少机器人策略对每个任务重新学习语义概念的需求。

在这一思路下，机器人策略的输入不再只是当前状态或预定义任务编号，而是由视觉观测和自然语言指令共同构成：

$$
\begin{equation}
a_t = \pi_\theta(I_t, s_t, l),
\end{equation}
$$

其中，($I_t$) 表示当前视觉观测，($s_t$) 表示机器人自身状态，($l$) 表示自然语言任务指令。

语言指令在这里不再只是一个用于区分任务的标签，而是承载任务目标、对象属性和空间约束的语义表示。例如，“拿起红色杯子”和“拿起蓝色杯子”共享相同的动作目标，但对应不同的视觉对象；“把杯子放进碗里”和“把杯子放在碗旁边”涉及相同对象，却具有不同的空间关系。模型需要联合理解语言和视觉，才能确定当前任务真正对应的操作目标。

因此，机器人任务开始从封闭的任务编号系统转向开放的语言条件形式：

$$
\begin{equation}
\text{task ID}
\rightarrow
\text{natural-language instruction}.
\end{equation}
$$

这一转变使不同任务进入了一个共享的语义空间。在离散任务编号中，“抓取杯子”和“抓取碗”只是两个彼此独立的类别；而在语言表示中，它们共享“抓取”这一动作语义，只在目标对象上存在差异。模型因此有可能将已经学到的动作知识迁移到新的对象和新的语言组合中。

更重要的是，自然语言使机器人能够利用大语言模型中的常识和高层任务知识。模型可以理解抽屉通常通过把手被拉开，杯子可以被放入水槽，刀具通常应该从手柄位置抓取。虽然这些语义知识不足以直接解决低层控制问题，但它们可以帮助机器人判断应该操作什么对象、应该关注图像中的什么区域，以及当前任务大致包含哪些阶段。

由此，机器人策略需要同时解决三个相互关联的问题：

$$
\begin{equation}
\text{任务理解}
+
\text{视觉场景理解}
+
\text{动作生成}.
\end{equation}
$$

语言模型和视觉语言模型已经分别展示了前两种能力，而机器人学习需要进一步解决第三个问题：如何将高层语义理解转化为能够在物理环境中执行的连续动作。

早期方法通常采用模块化结构来完成这一连接。视觉语言模型负责理解指令、识别目标对象或生成高层计划，底层控制器则负责执行具体动作。整个系统可以写成：

$$
\begin{equation}
z_t = f_{\mathrm{VLM}}(I_t, l),
\end{equation}
$$

$$
\begin{equation}
a_t = \pi_\theta(s_t, z_t),
\end{equation}
$$

其中，($z_t$) 表示视觉语言模型输出的目标位置、对象类别、技能标签或高层子任务。

在这种结构中，视觉语言模型负责回答“应该做什么”，底层策略负责回答“具体应该怎样移动机器人”。例如，视觉语言模型可以先确定需要抓取桌面上的红色杯子，再调用预先训练好的抓取策略完成动作。

模块化方法降低了直接训练统一模型的难度，也能够利用现有的视觉语言模型和机器人技能库。然而，这种方法存在明显的接口瓶颈。高层模型通常只能通过有限的离散技能、目标坐标或文本子任务向低层控制器传递信息，大量视觉和语言信息会在中间表示中丢失。

例如，高层模型可能输出“抓取杯子”，但低层策略仍然需要独立判断杯子的精确位置、合适的抓取姿态以及如何避开障碍物。如果高层语义与低层控制之间的接口过于粗糙，视觉语言模型的知识便难以真正参与动作生成。

此外，高层计划与底层动作通常由不同模型分别训练。高层模型可能生成语义上合理、但在当前机器人和环境中不可执行的计划；低层控制器则只能在有限技能范围内执行动作，无法根据任务语义灵活调整行为。这种感知、推理与控制之间的分离，限制了系统的整体泛化能力。

研究者由此进一步提出：与其将视觉语言模型仅作为机器人系统中的高层规划模块，是否可以直接将机器人动作纳入视觉语言模型的输出空间，使视觉理解、语言推理和动作生成在同一个模型中联合学习？

传统视觉语言模型学习的是从视觉和语言输入到文本输出的映射：

$$
\begin{equation}
p(y \mid I_t, l).
\end{equation}
$$

Vision-Language-Action 模型则将输出从文本扩展为机器人动作：

$$
\begin{equation}
\pi_\theta(a_{t:t+H} \mid I_t, s_t, l).
\end{equation}
$$

其中，($a_{t:t+H}$) 表示从当前时刻开始的一段机器人动作序列。

这一变化标志着真正意义上的 VLA 开始形成。VLA 并不是简单地在传统机器人策略中加入一个语言编码器，也不是仅使用视觉语言模型生成高层任务计划，而是尝试在统一模型中直接建立视觉观测、语言指令与机器人动作之间的对应关系：

$$
\begin{equation}
\text{vision}
+
\text{language}
\rightarrow
\text{action}.
\end{equation}
$$

从这一阶段开始，大语言模型和视觉语言模型不再只是机器人系统的外部辅助模块，而逐渐成为机器人策略本身的基础。研究问题也由“如何使用语言选择已有技能”，进一步转变为：

> 如何将大规模视觉语言预训练中获得的语义理解和推理能力，真正转化为可执行、连续且受物理约束的机器人动作？

这一问题直接推动了早期 Vision-Language-Action 模型的发展。最初的解决方案是沿用大语言模型的序列建模范式，将连续机器人动作离散化为 action tokens，使文本、视觉和动作能够在统一的 Transformer 框架中进行建模。


## 将机器人动作表示为 Token

当研究者尝试把视觉语言模型扩展到机器人控制时，首先遇到的问题并不是如何设计更强的视觉编码器，而是如何表示机器人动作。

语言模型的输出由离散 token 构成。给定一段输入序列，模型在每个位置预测下一个 token 的条件概率：

$$
\begin{equation}
p(y_{1:N} \mid x) = \prod_{i=1}^{N}
p(y_i \mid y_{<i}, x).
\end{equation}
$$

其中，输入 ($x$) 可以是文本，也可以进一步包含图像特征；输出 ($y_i$) 则来自一个有限的离散词表。模型通过 next-token prediction 学习语言中的结构和语义关系。

机器人动作与文本 token 存在明显差异。机械臂的动作通常由连续数值构成，例如末端执行器的位置增量、旋转增量、夹爪状态或各个关节的控制量。一个典型动作可以写成：

$$
\begin{equation}
a_t =
[
\Delta x_t,
\Delta y_t,
\Delta z_t,
\Delta r_t,
\Delta p_t,
\Delta y_t^{\mathrm{rot}},
g_t
],
\end{equation}
$$

其中前三项表示末端位置变化，中间三项表示旋转变化，($g_t$) 表示夹爪控制信号。

这种连续动作无法直接作为语言模型词表中的普通 token。为了复用 Transformer 和自回归语言建模框架，早期 VLA 的一个自然选择是将连续动作离散化。

对于动作中的每一个连续维度，可以首先设定取值范围，然后将其划分为有限数量的区间。设某个动作维度 ($a^{(d)}$) 的范围为：

$$
\begin{equation}
a^{(d)} \in [a_{\min}^{(d)}, a_{\max}^{(d)}],
\end{equation}
$$

将其划分为 ($K$) 个离散区间后，连续动作可以映射为离散编号：

$$
\begin{equation}
q^{(d)} =
Q(a^{(d)})
\in
{1,2,\ldots,K}.
\end{equation}
$$

整个机器人动作因此可以表示为一组离散 action tokens：

$$
\begin{equation}
a_t
\rightarrow
[
q_t^{(1)},
q_t^{(2)},
\ldots,
q_t^{(D)}
].
\end{equation}
$$

这样，机器人动作便可以和文本 token 一样，由 Transformer 使用分类方式预测。模型不再直接回归连续数值，而是在每个动作维度上预测对应的离散区间。

这一设计的重要意义在于，它使视觉、语言和动作能够进入统一的序列建模框架。模型的输入可以由图像、自然语言指令和历史动作共同组成，输出则是一系列离散动作 token：

$$
\begin{equation}
\text{image tokens}
+
\text{language tokens}
+
\text{action tokens}.
\end{equation}
$$

在这一框架下，机器人控制被重新表述为一个序列预测问题：

$$
\begin{equation}
p(a_{1:T} \mid I_{1:T}, l) =
\prod_{t=1}^{T}
p(a_t \mid a_{<t}, I_{\leq t}, l).
\end{equation}
$$

模型根据当前视觉观测、语言指令和过去动作，预测下一时刻应该执行的动作。原本属于连续控制的问题，由此被转化为类似语言生成的自回归过程。

RT-1 是这一阶段具有代表性的工作之一。它使用 Transformer 处理图像观测、自然语言指令和机器人动作，并将连续动作离散化后进行 token prediction。当机器人数据达到一定规模后，一个统一的序列模型可以同时学习大量不同任务，而不再需要为每个技能训练独立策略。

这种方法推动机器人学习从多个独立任务策略进一步发展为 generalist policy。模型在同一组参数中学习抓取、移动、放置、开关抽屉等多种行为，并根据语言指令决定当前需要执行的任务。

与传统多任务策略相比，早期 VLA 的区别在于，它不再仅仅将语言编码为一个固定条件向量，而是让视觉、语言和动作在 Transformer 内部进行联合建模。语言信息可以参与每个时间步的动作决策，视觉特征也不再只是预先提取后输入一个独立控制头，而是成为整个序列表示的一部分。

这一阶段可以概括为：

$$
\begin{equation}
\text{multi-task policy}
\rightarrow
\text{token-based generalist robot policy}.
\end{equation}
$$

然而，RT-1 一类模型主要依赖机器人轨迹数据进行训练。虽然它们能够在多个机器人任务之间共享知识，但其视觉语义能力仍然主要由机器人数据决定。与互联网规模的图像和文本数据相比，机器人数据的规模依然有限，对开放世界物体、陌生场景和复杂语言指令的覆盖不足。

研究者因此开始进一步思考：既然视觉语言模型已经通过互联网数据学习了广泛的视觉概念和语言知识，是否可以直接将这种知识迁移到机器人动作预测中？

RT-2 代表了这一方向的重要转变。它不再将 VLA 仅仅视为一个从机器人数据中训练的多任务控制器，而是将机器人动作也表达为语言模型可以预测的 token，使视觉语言模型可以同时接受互联网视觉语言数据和机器人轨迹数据训练。

在普通视觉语言数据中，模型学习：

$$
\begin{equation}
p(y_{\mathrm{text}} \mid I, l),
\end{equation}
$$

而在机器人轨迹数据中，模型学习：

$$
\begin{equation}
p(y_{\mathrm{action}} \mid I, l).
\end{equation}
$$

由于文本输出和动作输出都被编码为离散 token，两类数据可以被放入同一个生成框架：

$$
\begin{equation}
y
\in
{
y_{\mathrm{text}},
y_{\mathrm{action}}
}.
\end{equation}
$$

这意味着，视觉语言模型在互联网数据中获得的对象识别、语义关联和常识推理能力，可以通过共享参数影响机器人动作预测。

例如，模型可能没有在机器人数据中见过某一种特定物体，但已经在互联网图像和文本中学习过该物体的视觉外观和语言名称。当机器人接收到相关指令时，它有可能利用预训练的视觉语言知识定位该物体，并将已有的抓取能力迁移到新的对象上。

这一能力通常被称为 semantic generalization。VLA 不再只是记住训练集中某条语言指令对应什么动作，而开始利用视觉语言基础模型中的语义结构处理新的物体、指令和组合任务。

从这一意义上看，RT-2 的关键并不只是模型规模更大，而是改变了机器人策略的知识来源。机器人能力不再完全由机器人轨迹数据决定，而是由两类数据共同塑造：

$$
\begin{equation}
\text{internet vision-language data}
+
\text{robot action data}
\rightarrow
\text{VLA policy}.
\end{equation}
$$

互联网数据提供语义知识和视觉泛化能力，机器人数据则提供从感知和任务目标到具体动作的映射。VLA 因而逐渐具有两种不同层次的能力：

$$
\begin{equation}
\text{semantic knowledge}
+
\text{motor behavior}.
\end{equation}
$$

前者回答“场景中有什么、任务要求什么、哪些对象与任务相关”，后者回答“机器人应该具体怎样运动”。

这一组合奠定了通用 VLA 的基本范式。模型通过大规模视觉语言预训练获得开放词汇理解能力，再通过机器人轨迹学习动作输出。与从头训练机器人策略相比，这种方法能够利用远多于机器人数据规模的互联网知识，并在新对象和新语言组合上表现出更强的泛化能力。

但是，将动作表示为 token 并不意味着机器人控制已经真正等同于语言生成。文本和动作在数学形式上可以被统一为离散序列，但它们在实际任务中的性质仍然不同。

首先，文本 token 本身具有明确的离散语义。一个词或子词 token 即使发生微小变化，通常只会影响语言表达；而机器人动作本质上是连续控制量，离散化会直接引入数值误差。

假设连续动作 ($a$) 被量化为 ($Q(a)$)，再从离散 token 恢复为动作 ($\hat a$)，则量化误差为：

$$
\begin{equation}
\epsilon_q =
\lVert a - \hat a \rVert.
\end{equation}
$$

当离散区间数量较少时，每个动作 token 覆盖的连续范围较大，模型难以生成精细动作；当区间数量增多时，输出词表和分类难度也会相应增加。

对于自由空间中的大幅移动，较小的量化误差可能不会显著影响任务结果。但在抓取、插入、旋转和接触操作中，几毫米的位置误差或较小的姿态误差，就可能使机器人错过目标或失去接触。因此，动作 token 的离散化精度直接限制了策略能够达到的控制精度。

其次，自回归预测会带来推理延迟。如果一个动作由多个维度组成，并且每个维度被编码为一个 token，那么生成单个控制步就可能需要预测多个 token。对于需要持续控制的机器人而言，逐 token 解码的计算成本可能难以满足较高控制频率。

设每个动作包含 ($D$) 个 action tokens，任务持续 ($T$) 个控制步，则模型需要生成的 token 数量大致为：

$$
\begin{equation}
N_{\mathrm{token}} = T D.
\end{equation}
$$

随着动作维度、任务时长和模型规模增加，自回归推理成本会迅速上升。

再次，机器人动作具有强烈的时间连续性。相邻动作通常需要保持平滑，并共同构成具有明确动力学结构的局部运动轨迹。然而，逐 token 分类主要优化每个离散动作符号的预测准确率，并不会天然保证整个动作序列在连续空间中的平滑性和一致性。

更重要的是，机器人任务往往具有多模态动作分布。对于同一个视觉状态和任务目标，机器人可能存在多个合理动作。例如，它可以从物体左侧或右侧接近，也可以选择不同的抓取姿态。离散自回归模型理论上可以表示这种多模态性，但动作维度之间的逐 token 分解可能使联合动作分布难以建模。

一个机器人动作通常不是若干独立维度的简单组合。末端位置、姿态和夹爪状态之间存在强耦合关系。如果模型分别预测各维度 token，就可能产生单个维度看似合理、组合后却不可执行的动作。

因此，第一代 token-based VLA 解决了视觉、语言和动作的统一建模问题，却留下了连续控制层面的矛盾：

$$
\begin{equation}
\text{统一的离散序列建模}
\quad \text{vs.} \quad
\text{高精度连续动作生成}.
\end{equation}
$$

它证明了视觉语言基础模型可以被扩展为机器人策略，也证明了互联网语义知识能够帮助机器人泛化。但随着研究从简单桌面任务走向更高维、更灵巧和更长程的控制，action token 的局限逐渐显现。

研究者由此开始将问题重新表述为：

> 是否可以保留视觉语言基础模型的语义理解能力，同时不再强迫机器人动作服从离散语言 token 的表示形式？

这一问题推动 VLA 从 token-based action prediction 转向连续动作建模。模型仍然使用视觉语言主干理解场景和任务，但动作部分开始由独立的连续 action head 或 action expert 生成。

最初的连续动作方法通常直接使用回归目标：

$$
\begin{equation}
\hat a_t
=
f_\theta(I_t, s_t, l),
\end{equation}
$$

并通过均方误差学习专家动作：

$$
\begin{equation}
\mathcal L_{\mathrm{reg}}
=
\lVert
\hat a_t - a_t^\ast
\rVert_2^2.
\end{equation}
$$

然而，简单回归很快暴露出新的问题。机器人任务通常并不存在唯一正确动作，当训练数据中包含多个可行行为模式时，均方误差会倾向于预测它们的平均值，而平均动作未必对应任何真实可执行行为。

因此，VLA 的下一阶段并不是从 action token 简单回到连续回归，而是进一步引入 diffusion 和 flow matching 等生成式动作模型，使策略能够直接学习复杂、多模态的连续动作分布。



## 从连续动作回归到生成式动作模型

当 VLA 从离散 action tokens 转向连续动作表示后，最直接的方法是让模型根据视觉观测、语言指令和机器人状态直接回归动作 (公式见上)。

这种方法避免了动作离散化带来的量化误差，也不再需要将每个动作维度映射为 token。模型可以直接输出末端位姿增量、关节位置或其他连续控制量，因此在形式上更符合机器人控制的本质。

然而，直接回归隐含了一个较强假设：对于给定观测和任务，专家动作在动作空间中近似服从单峰分布，即存在一个相对确定的最优动作。

但是这一假设在许多机器人任务中并不成立。

例如，对于桌面上的一个物体，机器人可以从左侧接近，也可以从右侧接近；对于同一个杯子，可以选择不同的抓取位置和手腕姿态；在移动操作任务中，也可能存在多条不同但都可行的导航和操作路径。

因此，同一个条件输入 ($x$) 可能对应多个合理动作：

$$
\begin{equation}
p(a \mid x)
=
\sum_{k=1}^{K}
\pi_k p_k(a \mid x),
\end{equation}
$$

其中，($x$) 可以包含视觉观测、语言指令和机器人状态，($K$) 表示不同的行为模式。

如果训练数据中同时包含多个动作模式，而模型使用均方误差进行确定性回归，那么最优解会趋向于条件均值：

$$
\begin{equation}
\hat a
=
\mathbb E[a \mid x].
\end{equation}
$$

但多个可行动作的平均值并不一定仍然是一个可行动作。

例如，一部分专家轨迹从障碍物左侧绕行，另一部分从右侧绕行。若模型对两类轨迹进行平均，输出的路径可能正好穿过障碍物。类似地，多个不同抓取姿态的平均值可能既不对应左侧抓取，也不对应右侧抓取，而是落在一个不稳定的位置。

这一现象通常被称为 mode averaging。它说明，连续动作建模不能只关注预测误差，还需要显式表示动作分布的多模态性。

研究者因此开始将生成式模型引入机器人策略。与直接预测唯一动作不同，生成式策略学习完整的条件动作分布：

$$
\begin{equation}
p_\theta(a \mid I_t, s_t, l).
\end{equation}
$$

推理时，模型可以从这一分布中采样不同但合理的动作，从而保留机器人行为中的多种可能性。

其中，diffusion model 成为这一阶段最重要的技术路线之一。

### Diffusion Policy

Diffusion model 最初主要用于图像生成。其核心思想是先逐步向真实数据加入噪声，再训练模型学习逆向去噪过程。

在机器人控制中，真实动作序列 ($A^\ast$) 可以被视为需要生成的数据。这里的动作通常不是一个单步动作，而是一段连续动作序列：

$$
\begin{equation}
A^\ast
=
[
a_t,
a_{t+1},
\ldots,
a_{t+H-1}
].
\end{equation}
$$

在前向加噪过程中，模型从真实动作序列构造带噪版本：

$$
\begin{equation}
A_\tau
=
\alpha_\tau A^\ast
+
\sigma_\tau \epsilon,
\end{equation}
$$

其中：

* ($\tau$) 表示噪声时间步；
* ($\epsilon \sim \mathcal N(0,I)$) 表示高斯噪声；
* ($\alpha_\tau$) 和 ($\sigma_\tau$) 控制信号与噪声的比例。

随着 ($\tau$) 增大，动作序列中的真实结构逐渐被噪声破坏。模型的任务是根据当前带噪动作 ($A_\tau$)、视觉观测、语言指令和机器人状态，预测加入的噪声或恢复干净动作。

一种常见训练目标是噪声预测：

$$
\begin{equation}
\mathcal L_{\mathrm{diff}} =
\mathbb E
\left[
\left|
\epsilon
-
\epsilon_\theta
(
A_\tau,
\tau,
I_t,
s_t,
l
)
\right|_2^2
\right].
\end{equation}
$$

推理时，模型从随机噪声动作序列开始：

$$
\begin{equation}
A_T \sim \mathcal N(0,I),
\end{equation}
$$

然后通过多次迭代逐步去除噪声：

$$
\begin{equation}
A_T
\rightarrow
A_{T-1}
\rightarrow
\cdots
\rightarrow
A_0.
\end{equation}
$$

最终得到一个满足当前视觉和语言条件的动作序列。

与直接回归相比，diffusion policy 的优势在于，它不需要将所有可行动作压缩为一个均值。不同随机噪声可以被映射到不同的动作模式，因此模型可以生成多个合理的抓取姿态、接近路径或局部控制轨迹。

从概率建模角度看，直接回归通常近似学习：

$$
\begin{equation}
\hat a
\approx
\mathbb E[a \mid x],
\end{equation}
$$

而 diffusion policy 试图学习：

$$
\begin{equation}
a
\sim
p(a \mid x).
\end{equation}
$$

这种差异对于机器人操作尤为重要。因为操作任务中的可行解往往不是一个点，而是动作空间中的多个分离区域。生成式模型能够保留这些区域，而不是将它们错误地平均在一起。

Diffusion policy 还有另一个重要特点：它通常直接生成一整段动作序列，而不是只预测下一步动作。模型由此不仅学习单个动作的合理性，还能学习动作序列内部的时间结构。

例如，在抓取过程中，接近、调整姿态、闭合夹爪和抬升物体之间存在明确的时序关系。如果模型一次生成完整的局部动作段，就更容易保持这些动作之间的协调性。

因此，diffusion policy 的作用不只是解决多模态问题，也推动机器人策略从单步动作预测转向局部轨迹生成。

### 为什么 VLA 开始预测 Action Chunk

早期机器人策略常采用单步控制形式：

$$
\begin{equation}
a_t
=
\pi_\theta(o_t,l).
\end{equation}
$$

模型在每个控制周期接收当前观测并预测一个动作。执行该动作后，环境进入新状态，模型再重新推理。

这种方式具有较强的闭环反馈能力。机器人每执行一步都可以根据最新观测进行修正，因此对环境变化较为敏感。

但对于大规模 VLA，这种单步预测存在明显效率问题。

VLA 的视觉语言主干通常规模较大，一次前向推理的成本远高于传统小型控制网络。如果机器人控制频率为几十赫兹，而模型每个控制步都需要重新处理图像、语言和长上下文，则推理开销会非常高。

此外，单步动作本身携带的信息有限。许多机器人行为具有明确的短时结构，例如：

* 机械臂连续向目标移动；
* 手腕逐渐旋转到抓取姿态；
* 夹爪在接近物体后闭合；
* 抓取成功后向上抬升。

如果模型每次只预测一个动作，它必须通过连续多次独立推理隐式维持这些行为的一致性。

为降低推理频率并增强局部动作连贯性，研究者开始让模型一次预测未来 ($H$) 步动作：

$$
\begin{equation}
A_t
=
[
a_t,
a_{t+1},
\ldots,
a_{t+H-1}
].
\end{equation}
$$

这种动作序列通常被称为 action chunk。

对应的策略写作：

$$
\begin{equation}
A_t
\sim
\pi_\theta
(
A_t
\mid
I_{\leq t},
s_{\leq t},
l
).
\end{equation}
$$

与单步策略相比，action chunking 将模型调用频率从每个控制步一次，降低为每执行若干步调用一次。

假设任务总共需要 ($T$) 个低层控制步，action chunk 长度为 ($H$)，若每个 chunk 完整执行，则大模型推理次数大约由：

$$
\begin{equation}
T
\end{equation}
$$

降低为：

$$
\begin{equation}
\frac{T}{H}.
\end{equation}
$$

这对参数规模较大的 VLA 非常关键。视觉语言主干可以较低频率运行，而低层控制器按照预先生成的 chunk 高频执行动作。

更重要的是，action chunk 本质上表示一个局部运动模式。模型不再只决定“当前向哪个方向移动”，而是直接预测一段具有时间一致性的局部轨迹。

因此，现代 VLA 的输出通常不再是单个动作，而是条件动作序列：

$$
\begin{equation}
\pi_\theta
(
a_{t:t+H}
\mid
I_t,
s_t,
l
).
\end{equation}
$$

action chunking 也与 diffusion model 自然结合。Diffusion model 擅长生成高维结构化数据，而整个动作 chunk 可以被视为一个维度为 ($H \times D$) 的结构化变量，其中 ($D$) 是单步动作维度。

模型可以联合生成整个动作块：

$$
\begin{equation}
A_t
\in
\mathbb R^{H \times D},
\end{equation}
$$

从而显式建模不同时间步和不同动作维度之间的相关性。

例如，末端位置、手腕姿态和夹爪开合并不是独立变量。一个成功抓取通常要求：

1. 末端逐步接近目标；
2. 手腕姿态与目标几何结构对齐；
3. 夹爪保持打开；
4. 到达合适位置后再闭合；
5. 闭合完成后执行抬升。

如果逐维、逐时间步独立预测，模型很难保证这些动作严格协调。联合生成完整 action chunk 则可以更自然地学习这一时序结构。

### Action Chunking 的代价

action chunk 越长，推理效率通常越高，但闭环反馈能力也会下降。

如果模型一次生成 ($H$) 步动作并全部执行，那么在这 ($H$) 步内，策略不会重新观察环境。此时，机器人实际上进行的是局部开环控制。

设模型在时刻 ($t$) 根据观测 ($o_t$) 生成：

$$
\begin{equation}
A_t
=
[
a_t,
a_{t+1},
\ldots,
a_{t+H-1}
].
\end{equation}
$$

但在执行过程中，真实环境状态可能由于控制误差、物体运动或接触变化而偏离模型预期：

$$
\begin{equation}
s_{t+k}^{\mathrm{real}}
\neq
s_{t+k}^{\mathrm{pred}}.
\end{equation}
$$

如果模型仍继续执行剩余动作，则偏差可能不断累积。

这一问题在自由空间移动中可能并不严重，但在接触操作中非常关键。抓取、插入、开门和物体放置都依赖实时接触状态。某一步的微小误差可能使夹爪错过目标，而后续动作若仍按照原始 chunk 执行，就可能进一步扩大失败。

因此，action chunking 存在一个基本折中：

$$
\begin{equation}
\text{longer chunk}
\rightarrow
\text{higher efficiency}
+
\text{stronger temporal coherence},
\end{equation}
$$

但同时：

$$
\begin{equation}
\text{longer chunk}
\rightarrow
\text{weaker feedback}
+
\text{larger open-loop error}.
\end{equation}
$$

较短 chunk 能够频繁重新观测和纠正，但会增加大模型推理次数；较长 chunk 能够提高效率，却更容易受到环境偏差和接触不确定性的影响。

实际系统通常不会简单地完整执行整个 chunk，而是采用 receding-horizon control。

模型在时刻 ($t$) 预测长度为 ($H$) 的动作序列，但只执行其中前 ($h$) 步，其中：

$$
\begin{equation}
h < H.
\end{equation}
$$

执行完前 ($h$) 步后，机器人重新获取视觉观测，并生成新的动作 chunk：

$$
\begin{equation}
A_t
\rightarrow
\text{execute first } h \text{ actions}
\rightarrow
o_{t+h}
\rightarrow
A_{t+h}.
\end{equation}
$$

这种方式保留了 action chunk 的局部时间建模能力，同时允许机器人定期根据新观测修正计划。

整个执行过程可以写为：

$$
\begin{equation}
\text{observe}
\rightarrow
\text{generate chunk}
\rightarrow
\text{execute partially}
\rightarrow
\text{re-observe}
\rightarrow
\text{replan}.
\end{equation}
$$

这成为现代 VLA 中常见的闭环执行方式。

### 从 Diffusion 到 Flow Matching

尽管 diffusion policy 能够有效表示多模态连续动作，但其推理过程通常需要多次迭代去噪。

如果模型需要执行 ($N$) 个去噪步骤，那么每生成一个 action chunk，action head 就需要进行 ($N$) 次前向计算：

$$
\begin{equation}
A_N
\rightarrow
A_{N-1}
\rightarrow
\cdots
\rightarrow
A_0.
\end{equation}
$$

对于机器人控制而言，推理延迟尤其敏感。即使 action chunking 降低了视觉语言主干的调用频率，多步 diffusion sampling 仍可能成为系统瓶颈。

研究者因此开始探索更高效的生成式动作建模方法，其中 flow matching 成为现代 VLA 中的重要选择。

Flow matching 同样从简单噪声分布出发，并将其变换为真实动作分布。但与传统 diffusion 逐步预测去噪方向不同，flow matching 直接学习概率路径上的连续速度场。

设 ($A_0$) 为从简单噪声分布采样的动作：

$$
\begin{equation}
A_0
\sim
\mathcal N(0,I),
\end{equation}
$$

($A_1$) 为真实专家动作 chunk：

$$
\begin{equation}
A_1
\sim
p_{\mathrm{data}}(A).
\end{equation}
$$

可以在二者之间构造一条线性插值路径：

$$
\begin{equation}
A_\tau
=
(1-\tau)A_0
+
\tau A_1,
\end{equation}
$$

其中：

$$
\begin{equation}
\tau \in [0,1].
\end{equation}
$$

当 ($\tau=0$) 时，($A_\tau$) 是纯噪声；当 ($\tau=1$) 时，($A_\tau$) 是真实动作。

这条路径对应的目标速度为：

$$
\begin{equation}
v^\ast = \frac{dA_\tau}{d\tau} = A_1-A_0.
\end{equation}
$$

模型学习根据当前中间状态 ($A_\tau$)、时间 ($\tau$) 以及视觉语言条件预测这一速度：

$$
\begin{equation}
v_\theta
=
v_\theta
(
A_\tau,
\tau,
I_t,
s_t,
l
).
\end{equation}
$$

训练目标可以写为：

$$
\begin{equation}
\mathcal L_{\mathrm{FM}}
=
\mathbb E
\left[
\left|
v_\theta
(
A_\tau,
\tau,
I_t,
s_t,
l
)
-
(A_1-A_0)
\right|_2^2
\right].
\end{equation}
$$

推理时，模型从随机噪声动作 ($A_0$) 出发，根据学习到的速度场求解常微分方程：

$$
\begin{equation}
\frac{dA_\tau}{d\tau}
=
v_\theta
(
A_\tau,
\tau,
I_t,
s_t,
l
).
\end{equation}
$$

通过从 ($\tau=0$) 积分到 ($\tau=1$)，最终得到动作 chunk：

$$
\begin{equation}
A_1
=
A_0
+
\int_0^1
v_\theta(A_\tau,\tau,I_t,s_t,l)
\,d\tau.
\end{equation}
$$

从直觉上看，flow matching 学习的是：对于任意一个带噪动作状态，应该沿哪个方向移动，才能逐渐到达符合当前任务条件的动作分布。

与简单动作回归相比，flow matching 仍然保留随机初始噪声，因此能够生成多种合理行为；与传统 diffusion 相比，它使用连续速度场描述从噪声到动作的变换，通常可以通过更少的积分步数完成采样。

因此，flow matching 同时满足现代 VLA 的几个重要需求：

* 保留连续动作精度；
* 表达多模态动作分布；
* 联合生成完整 action chunk；
* 使用较少采样步骤降低推理延迟；
* 与视觉语言基础模型的条件特征结合。

这一结构逐渐形成现代 VLA 的典型架构：

$$
\begin{equation}
\text{VLM backbone}
+
\text{continuous action expert}.
\end{equation}
$$

视觉语言主干负责处理图像和语言，生成包含场景语义、任务目标和上下文信息的表示；action expert 则根据这些表示，通过 diffusion 或 flow matching 生成连续动作 chunk。

二者的职责开始出现明确分工：

$$
\begin{equation}
\text{VLM backbone}
\rightarrow
\text{understand what to do},
\end{equation}
$$

$$
\begin{equation}
\text{action expert}
\rightarrow
\text{generate how to do it}.
\end{equation}
$$

但这并不是完全模块化的高层规划与低层控制。action expert 通常与视觉语言主干联合训练，并持续接收其隐藏表示，因此语义理解能够直接影响连续动作生成。

这一阶段标志着 VLA 从“将动作作为一种特殊语言 token”进一步发展为“使用视觉语言基础模型理解任务，再用生成式连续策略产生动作”。

其演化过程可以概括为：

$$
\begin{equation}
\text{discrete action tokens}
\rightarrow
\text{continuous regression}
\rightarrow
\text{diffusion action generation}
\rightarrow
\text{flow-based action generation}.
\end{equation}
$$

但是，连续生成式动作模型主要解决的是局部控制表达能力。即使模型能够生成高质量 action chunks，它仍然需要回答另一个更困难的问题：

> 当任务持续数百甚至数千个控制步，并包含多个不同阶段时，模型如何维持长期目标、判断当前进度，并决定下一步应该执行哪种技能？

这推动 VLA 从局部动作生成进一步走向层次化推理和长程任务执行。


## 从局部动作生成到层次化长程任务执行

Diffusion 和 flow matching 解决了连续动作生成中的多模态性、精度和时间一致性问题，也使 VLA 能够一次预测具有结构的 action chunk。然而，这些方法主要改善的是局部动作建模能力。

对于一个持续时间较短的操作任务，例如抓取桌面上的物体，模型可以根据当前图像和语言指令直接生成一段连续动作。只要视觉观测足够清晰，目标位置没有发生显著变化，局部 action chunk 往往能够完成接近、对齐、闭合夹爪和抬升等动作。

但在长程任务中，机器人需要完成的并不是单一局部动作，而是一系列相互依赖的阶段。例如，“找到厨房中的杯子并将其放入水槽”可能包含：

$$
\begin{equation}
\text{寻找杯子}
\rightarrow
\text{导航到杯子附近}
\rightarrow
\text{调整操作位姿}
\rightarrow
\text{抓取杯子}
\rightarrow
\text{导航到水槽}
\rightarrow
\text{放置杯子}.
\end{equation}
$$

每一个阶段都可能持续多个 action chunks，并且不同阶段需要模型关注不同信息。导航阶段主要依赖场景布局和目标位置，抓取阶段则更依赖局部几何、姿态和接触状态。即使局部动作生成器在每个短时间窗口内都较为准确，模型仍然需要持续判断当前任务进展，并决定下一阶段应该做什么。

因此，长程任务的难点并不只是动作序列更长，而是任务本身具有明确的阶段结构。

### 长程任务中的误差累积

假设一个任务可以分解为 ($M$) 个子任务，每个子任务独立成功的概率为 ($p_i$)，那么整体成功率可以近似写为：

$$
\begin{equation}
P_{\mathrm{success}}
=
\prod_{i=1}^{M} p_i.
\end{equation}
$$

如果每个阶段的成功率相同，即：

$$
\begin{equation}
p_i=p,
\end{equation}
$$

则有：

$$
\begin{equation}
P_{\mathrm{success}}
=
p^M.
\end{equation}
$$

这意味着，即使每个局部阶段都具有较高成功率，随着阶段数量增加，整体任务成功率仍会快速下降。

例如，当单个阶段成功率为 ($0.9$) 时，包含两个阶段的任务成功率约为：

$$
\begin{equation}
0.9^2=0.81,
\end{equation}
$$

而包含十个阶段时则下降为：

$$
\begin{equation}
0.9^{10}\approx0.35.
\end{equation}
$$

真实机器人任务中的阶段并不完全独立，因此这一公式只是近似。但它揭示了长程任务的核心问题：局部策略中看似较小的误差，会在多阶段执行过程中不断累积。

更重要的是，前一个阶段的失败会改变后续阶段的输入分布。例如，如果机器人在抓取时没有稳定夹住物体，那么后续“将物体带到水槽”的动作即使本身正确，也已经失去意义。长程任务中的错误不是简单相加，而是会改变后续任务是否仍然可执行。

因此，模型不仅需要提高每个 action chunk 的质量，还必须具备检测错误、重新规划和恢复执行的能力。

### 为什么单一反应式策略难以处理长程任务

最简单的长程 VLA 仍然可以写成一个统一策略：

$$
\begin{equation}
A_t
\sim
\pi_\theta
(
A_t
\mid
I_{\leq t},
s_{\leq t},
l
).
\end{equation}
$$

模型根据当前及历史观测、机器人状态和语言任务，直接生成下一段动作。理论上，只要模型容量足够大并拥有足够多的长程训练数据，它可以隐式学习完整任务。

但这种完全端到端的反应式策略面临几个问题。

首先，模型需要从有限上下文中同时推断当前处于哪个任务阶段，以及这一阶段应该执行什么动作。对于持续数分钟的任务，早期观测和动作可能已经超出模型上下文，模型只能依赖当前场景推断历史进度。

例如，机器人当前站在水槽旁边，但仅从这一时刻的视觉观测中，模型未必能判断它是刚刚开始任务，还是已经抓住杯子并完成了导航。任务状态并不总能由单帧图像完全确定。

因此，长程执行通常需要某种记忆或历史状态：

$$
\begin{equation}
h_t
=
f(h_{t-1},o_t,a_{t-1}),
\end{equation}
$$

其中 ($h_t$) 用于记录过去发生了什么，以及当前任务已经完成到哪一个阶段。

其次，不同阶段对应的动作分布差异很大。导航阶段需要生成底盘运动，抓取阶段需要生成机械臂和夹爪动作，放置阶段则需要同时考虑目标容器和物体稳定性。要求同一个局部生成器在没有明确阶段提示的情况下直接覆盖所有动作模式，会显著增加学习难度。

再次，长程任务中存在大量无效动作。模型可能已经到达目标附近，却继续进行导航；也可能尚未完成抓取，就提前开始移动到底盘目标位置。这类错误往往不是低层动作本身不合理，而是动作与当前任务阶段不匹配。

因此，长程任务需要模型显式或隐式地表示当前子任务。

### 层次化决策

为降低长程决策难度，研究者开始将任务分解为不同时间尺度上的决策过程。

高层策略负责根据视觉观测、语言目标和历史信息判断当前应执行的子任务：

$$
\begin{equation}
z_t
=
\pi_{\mathrm{high}}
(
o_{\leq t},
l
),
\end{equation}
$$

其中 ($z_t$) 可以表示：

* 自然语言子任务；
* 离散技能编号；
* 目标对象；
* 目标位置；
* 潜在计划变量；
* 当前任务阶段。

低层策略则根据高层输出生成具体动作：

$$
\begin{equation}
A_t
\sim
\pi_{\mathrm{low}}
(
A_t
\mid
o_t,
s_t,
l,
z_t
).
\end{equation}
$$

例如，在“将杯子放入水槽”任务中，高层策略可以依次输出：

$$
\begin{equation}
z_1=\text{locate cup},
\end{equation}
$$

$$
\begin{equation}
z_2=\text{navigate to cup},
\end{equation}
$$

$$
\begin{equation}
z_3=\text{grasp cup},
\end{equation}
$$

$$
\begin{equation}
z_4=\text{navigate to sink},
\end{equation}
$$

$$
\begin{equation}
z_5=\text{place cup}.
\end{equation}
$$

低层策略则负责将这些子任务转化为具体 action chunks。

层次化结构的主要作用是将一个超长时间范围的问题，分解为多个较短的局部控制问题。高层策略不需要输出高频关节动作，而只在较低频率上决定当前任务阶段；低层策略则不需要理解完整任务历史，只需在给定子任务下完成当前动作。

整个系统可以写成：

$$
\begin{equation}
\text{language goal}
\rightarrow
\text{subtask}
\rightarrow
\text{action chunk}.
\end{equation}
$$

这种分解降低了动作搜索空间，也使不同阶段可以采用不同策略或控制方式。例如，导航阶段可以调用移动策略，抓取阶段可以调用操作策略，而放置阶段可以使用另一个专门的动作生成器。

### 显式层次与隐式层次

层次化 VLA 并不一定要求系统由完全独立的高层和低层模型组成。

一种方式是显式层次化。高层模型生成自然语言计划或技能 token，低层策略再根据这些中间表示执行动作：

$$
\begin{equation}
l
\rightarrow
[z_1,z_2,\ldots,z_M]
\rightarrow
[A_1,A_2,\ldots,A_M].
\end{equation}
$$

这种设计具有较强可解释性。研究者可以直接观察模型当前计划执行什么子任务，也可以在某个阶段失败后单独重新规划。

但显式层次结构也会产生接口误差。如果高层模型生成了语义合理但物理上不可执行的计划，低层策略无法完成对应动作。高层模型可能认为“从左侧抓取物体”是合理的，但当前机器人工作空间、障碍物位置或机械臂构型并不允许这一行为。

另一种方式是隐式层次化。模型不显式输出语言子任务，而是在隐藏状态中形成不同时间尺度的表示。视觉语言主干负责建模高层任务语义和长期上下文，action expert 则根据这些隐藏表示生成局部动作。

此时，模型仍然可以写成：

$$
\begin{equation}
h_t
=
f_{\mathrm{VLM}}
(
I_{\leq t},
l
),
\end{equation}
$$

$$
\begin{equation}
A_t
=
g_{\mathrm{action}}
(
h_t,
s_t
).
\end{equation}
$$

其中 ($h_t$) 可能隐式包含当前任务阶段、目标对象和历史进度。

隐式层次化减少了人工设计接口的需要，也允许高层语义和低层动作联合训练。但它的缺点是任务状态不容易解释，失败时也更难判断究竟是高层计划错误，还是低层动作执行错误。

因此，现代 VLA 往往位于完全模块化和完全端到端之间。模型可能使用统一视觉语言主干，但通过子任务 token、历史上下文、不同 action head 或技能条件，引入一定程度的时间尺度分解。

### 闭环重规划

无论采用显式还是隐式层次，长程任务都不能只在开始时生成一次完整计划，然后开环执行到底。

真实环境中可能出现：

* 目标物体位置变化；
* 导航路径被阻挡；
* 抓取失败；
* 物体滑落；
* 接触状态变化；
* 子任务完成时间与预期不同。

因此，长程 VLA 通常采用闭环重规划。模型在执行一个 action chunk 或子任务后重新观察环境，并根据最新状态判断下一步：

$$
\begin{equation}
o_t
\rightarrow
z_t
\rightarrow
A_t
\rightarrow
o_{t+1}
\rightarrow
z_{t+1}.
\end{equation}
$$

这意味着，高层计划本身也不是固定的，而是随着环境反馈不断更新。

一个典型执行循环可以写成：

$$
\begin{equation}
\text{observe}
\rightarrow
\text{infer current stage}
\rightarrow
\text{generate action chunk}
\rightarrow
\text{execute}
\rightarrow
\text{evaluate progress}
\rightarrow
\text{replan}.
\end{equation}
$$

这一机制使模型能够在中间阶段修正行为。例如，如果抓取失败，模型可以重新进入抓取阶段，而不是继续执行运输；如果导航到错误位置，模型可以重新定位目标并调整路径。

因此，长程 VLA 的核心不只是层次化分解，还包括持续的状态估计和任务进度判断。

### 任务进度表示

为了进行闭环重规划，模型需要判断当前任务完成到了什么程度。最简单的方法是使用离散阶段标签：

$$
\begin{equation}
z_t
\in
{
\text{navigation},
\text{grasp},
\text{transport},
\text{place}
}.
\end{equation}
$$

但真实任务的进展通常是连续的。例如，在抓取阶段，机器人可能处于：

* 尚未接近目标；
* 已接近但姿态未对齐；
* 已接触但未稳定闭合；
* 已抓住但尚未抬升；
* 已完成抓取。

因此，任务进度也可以写成连续变量：

$$
\begin{equation}
p_t \in [0,1],
\end{equation}
$$

其中 ($p_t$) 表示当前子任务完成程度。

更一般地，可以为每个阶段定义一个进度函数：

$$
\begin{equation}
p_t^{(k)}
=
f_k(o_{\leq t},a_{<t}),
\end{equation}
$$

其中 ($k$) 表示第 ($k$) 个子任务。

进度估计可以帮助模型决定：

* 当前阶段是否完成；
* 是否应该切换到下一阶段；
* 是否发生失败；
* 是否需要恢复或重试；
* 当前动作是否正在产生有效进展。

这种进度表示对于长程任务非常重要，因为最终成功信号通常要到任务结束时才能获得。如果模型只能在结束时知道成功或失败，就很难判断中间哪个阶段出现问题。

### 长程任务中的不同误差类型

长程 mobile manipulation 通常包含导航和操作两类主要阶段，但二者的误差性质并不相同。

在导航阶段，机器人的状态变化通常较为平滑。一个较小的位置或方向误差往往可以在后续路径中被修正。即使机器人暂时偏离最优路径，只要仍能重新定位目标，就不一定导致任务失败。

操作阶段，尤其是抓取和接触阶段，则具有更强的非线性。一个很小的位姿误差可能使夹爪无法接触目标；一个轻微的姿态偏差可能导致物体滑落；接触是否建立通常会产生离散结果变化。

因此，长程任务并不是一个均匀困难的时间序列。不同阶段具有不同的误差敏感度：

$$
\begin{equation}
\text{navigation error}
\neq
\text{contact error}.
\end{equation}
$$

更具体地，可以写成：

$$
\begin{equation}
\left|
\frac{\partial R}
{\partial a_t}
\right|_{\mathrm{contact}}
>
\left|
\frac{\partial R}
{\partial a_t}
\right|_{\mathrm{navigation}},
\end{equation}
$$

其中 ($R$) 表示最终任务回报。这一表达表示，在接触阶段，动作的小变化通常更容易显著影响最终结果。

这意味着，一个统一策略即使在平均动作误差上表现良好，也可能在最关键的接触阶段频繁失败。长程 VLA 因此需要考虑阶段相关的建模和评价，而不能只使用整条轨迹的平均指标。

### 大规模预训练为什么仍不能完全解决长程问题

随着模型参数和训练数据增加，VLA 可以学习更多任务模式，也能够在一定程度上从数据中隐式获得任务分解和恢复能力。但单纯扩大行为克隆数据，并不能彻底解决长程执行问题。

原因在于，大多数机器人数据由成功专家轨迹构成。模型学习的是专家在正确状态下应该做什么，却很少看到自己执行错误后会进入什么状态。

训练数据通常来自：

$$
\begin{equation}
(o_t,a_t^\ast)
\sim
d_{\mathrm{expert}},
\end{equation}
$$

而部署时模型访问的状态分布为：

$$
\begin{equation}
o_t
\sim
d_{\pi_\theta}.
\end{equation}
$$

只要模型的动作与专家存在微小偏差，就可能逐渐进入专家数据覆盖不足的区域：

$$
\begin{equation}
d_{\pi_\theta}
\neq
d_{\mathrm{expert}}.
\end{equation}
$$

这种差异在短程任务中可能有限，但在长程任务中会不断累积。模型越早发生偏差，后续状态与训练分布的距离通常越大。

行为克隆能够告诉模型：

> 在专家访问的状态下，专家会采取什么动作。

但它不能充分回答：

> 当模型自己已经做错时，下一步应该如何恢复？

此外，行为克隆优化的是动作匹配，而不是任务结果。模型可能输出与专家略有不同的动作，这些动作在均方误差上看似不准确，但仍然能够完成任务；也可能输出与专家非常接近的动作，却因为接触误差最终失败。

因此，动作预测误差与任务成功率并不完全一致：

$$
\begin{equation}
\mathcal L_{\mathrm{BC}}
\not\equiv
-R_{\mathrm{task}}.
\end{equation}
$$

这构成了 VLA 从大规模预训练进一步走向 online reinforcement learning 的直接动机。

行为克隆负责让模型从大规模数据中获得基础感知、语义和动作能力：

$$
\begin{equation}
\text{pretraining}
\rightarrow
\text{initial policy}.
\end{equation}
$$

但长程执行要求模型在自己的状态分布中不断尝试，根据真实任务结果识别失败，并学习恢复和改进策略：

$$
\begin{equation}
\text{initial policy}
\rightarrow
\text{online rollout}
\rightarrow
\text{environment feedback}
\rightarrow
\text{policy improvement}.
\end{equation}
$$

由此，VLA 的研究重点开始从“如何学习一个能够模仿专家的通用策略”，逐渐转向：

> 如何让预训练 VLA 在真实或仿真环境中通过自身 rollout 持续改进，并真正优化长程任务成功率？

这推动了 online RL 在 VLA 中的发展。


## 从行为克隆到 Online Reinforcement Learning

大规模 VLA 通常首先通过行为克隆进行训练。给定包含视觉观测、语言指令和专家动作的机器人数据集：

$$
\begin{equation}
\mathcal D
=
{
(I_t,s_t,l,a_t^\ast)
},
\end{equation}
$$

模型学习在当前条件下预测专家动作：

$$
\begin{equation}
\pi_\theta(a_t \mid I_t,s_t,l).
\end{equation}
$$

对于自回归 action-token 模型，训练目标通常是最大化专家动作 token 的条件概率：

$$
\begin{equation}
\mathcal L_{\mathrm{BC}}
=
\mathbb E_{\mathcal D}
\left[
\log
\pi_\theta
(
a_t^\ast
\mid
I_t,s_t,l
)
\right].
\end{equation}
$$

对于连续回归策略，可以使用动作误差：

$$
\begin{equation}
\mathcal L_{\mathrm{BC}} = \mathbb E_{\mathcal D}
\left[
\left|
\hat a_t-a_t^\ast
\right|_2^2
\right].
\end{equation}
$$

对于 diffusion 或 flow-based VLA，虽然具体训练目标有所不同，但其本质仍然是利用专家数据学习条件动作分布。模型需要恢复或生成与数据集中专家动作一致的 action chunk。

行为克隆的优势十分明显。它不需要模型在训练过程中频繁与环境交互，而可以直接利用已经收集好的机器人轨迹。相比从随机策略开始进行强化学习，行为克隆能够迅速为 VLA 提供稳定的初始能力，使模型学会基本的视觉识别、语言条件执行和连续动作生成。

这一点对于高维机器人控制尤为重要。机器人动作空间通常较大，任务奖励又较为稀疏。如果没有专家数据，仅依赖随机探索发现有效抓取、放置或长程操作行为，通常需要极高的交互成本。行为克隆因此成为通用 VLA 的基础训练方式。

通过大规模行为克隆，模型可以学习：

* 如何根据语言找到目标对象；
* 如何生成基本抓取和放置动作；
* 如何在不同任务之间共享视觉与控制知识；
* 如何利用 action chunk 保持局部动作连贯性；
* 如何将视觉语言模型的语义表征转化为机器人动作。

从这一角度看，行为克隆解决的是 VLA 的能力初始化问题：

$$
\begin{equation}
\text{large-scale demonstrations}
\rightarrow
\text{general-purpose initial policy}.
\end{equation}
$$

然而，行为克隆优化的是对专家数据的拟合，而不是机器人在环境中的最终任务表现。即使模型在离线验证集上具有较低的动作预测误差，也不能保证它在闭环执行时获得较高成功率。

这一差异来自行为克隆的几个根本限制。

### 训练分布与执行分布不一致

行为克隆的数据通常来自专家策略。训练时，模型观察到的状态由专家动作产生：

$$
\begin{equation}
s_t
\sim
d_{\pi_E},
\end{equation}
$$

其中 ($\pi_E$) 表示专家策略，($d_{\pi_E}$) 表示专家访问的状态分布。

但在部署时，机器人执行的是模型自己的动作：

$$
\begin{equation}
s_t
\sim
d_{\pi_\theta}.
\end{equation}
$$

即使模型在每个时间步只产生很小的动作误差，真实环境状态也会逐渐偏离专家轨迹。之后，模型需要在训练数据较少覆盖的状态中继续决策。

因此通常存在：

$$
\begin{equation}
d_{\pi_\theta}
\neq
d_{\pi_E}.
\end{equation}
$$

这种现象被称为 distribution shift，也可以理解为 covariate shift。训练阶段的输入由专家行为决定，而推理阶段的输入由模型自己的历史行为决定。

假设模型每个时间步发生错误的概率为 ($\epsilon$)。在单步监督学习中，模型的期望误差可能看起来很小，但在长度为 ($T$) 的闭环任务中，至少发生一次错误的概率近似为：

$$
\begin{equation}
P(\text{error})
=
1-(1-\epsilon)^T.
\end{equation}
$$

当 ($T$) 增大时，即使 ($\epsilon$) 较小，整条轨迹发生偏差的概率也会迅速上升。

更严重的是，一次错误并不只是造成一个时间步的损失。它会将机器人带入新的状态，而模型在新状态上可能产生更大的错误，形成连续累积：

$$
\begin{equation}
\text{action error}
\rightarrow
\text{state deviation}
\rightarrow
\text{larger prediction error}
\rightarrow
\text{further deviation}.
\end{equation}
$$

这也是长程任务中 compounding error 的主要来源。

例如，在抓取任务中，模型可能在接近物体时产生几毫米偏差。单独看这一动作，它与专家动作非常接近；但偏差可能导致夹爪没有正确包围物体。之后模型仍然按照成功抓取后的状态继续抬升，最终整个任务失败。

在导航任务中，机器人也可能因为早期方向误差进入一个训练数据中较少出现的位置。即使目标仍然可达，策略也可能无法根据新的视角重新定位。

行为克隆主要学习专家状态下的正确动作，却很少学习如何从模型自身造成的偏差中恢复。

### 专家数据缺少失败与恢复过程

高质量机器人数据通常偏向成功轨迹。数据采集者会保留完成任务的示范，并删除明显失败、碰撞或无效操作的轨迹。

因此，训练集中的状态往往集中在成功行为附近：

$$
\begin{equation}
\mathcal D
\approx
\mathcal D_{\mathrm{success}}.
\end{equation}
$$

这有助于模型学习有效动作，但也意味着模型很少观察到失败状态。例如：

* 夹爪已经错过物体；
* 物体在运输过程中滑落；
* 机器人导航到错误位置；
* 抽屉接触已经断开；
* 放置目标被遮挡；
* 当前子任务被错误地提前切换。

当这些状态在实际执行中出现时，模型缺少相应的专家监督。

理想情况下，策略不仅需要知道成功路径上的动作，还需要学习恢复策略：

$$
\begin{equation}
\pi_{\mathrm{recover}}
(
a_t
\mid
s_t^{\mathrm{failure}}
).
\end{equation}
$$

例如，抓取失败后，机器人应该重新张开夹爪、调整姿态并再次尝试，而不是继续执行抬升动作；目标物体掉落后，机器人应该重新定位物体，而不是继续导航到原目标区域。

但失败状态和恢复过程很难通过普通专家示范大规模覆盖。失败类型具有组合性，不同任务、物体和环境可能产生大量不同偏差。试图为每一种失败手工收集恢复数据，成本极高。

因此，仅通过增加成功示范数量，并不能完全解决闭环鲁棒性问题。

### 动作模仿目标与任务目标并不一致

行为克隆优化的是动作与专家之间的相似性。强化学习则优化机器人最终获得的环境回报。

二者并不完全等价。

设行为克隆损失为：

$$
\begin{equation}
\mathcal L_{\mathrm{BC}}
=
\sum_t
\left|
a_t-a_t^\ast
\right|^2,
\end{equation}
$$

任务目标为：

$$
\begin{equation}
J(\pi)
=
\mathbb E_{\tau \sim \pi}
\left[
R(\tau)
\right],
\end{equation}
$$

其中 ($\tau$) 表示完整轨迹，($R(\tau)$) 表示任务回报。

一般情况下：

$$
\begin{equation}
\min_\theta
\mathcal L_{\mathrm{BC}}
\not\Rightarrow
\max_\theta
J(\pi_\theta).
\end{equation}
$$

原因在于，完成机器人任务通常存在多条可行路径。模型输出的动作可能与专家轨迹不同，但仍然可以成功完成任务。行为克隆会惩罚这种偏离，而任务回报并不会。

反过来，模型也可能输出与专家非常接近的动作，却因为某个关键接触位置略有误差而失败。此时动作损失很小，但任务回报为零。

因此，动作空间中的距离不能完全反映行为质量：

$$
\begin{equation}
\left|
a-a^\ast
\right|
\not\propto
R(a).
\end{equation}
$$

这一问题在接触操作中尤为明显。两个动作在数值上可能只相差很小，但一个能够建立稳定抓取，另一个则完全错过目标。任务结果具有较强的非连续性，而均方误差通常是平滑的。

对于长程任务，差异更加明显。行为克隆逐步优化局部动作误差，但最终成功取决于多个阶段是否协调完成。局部动作预测精度较高，并不一定意味着整体任务规划正确。

因此，VLA 需要从单纯模仿专家动作，进一步转向直接利用任务结果学习。

### 从 Offline Imitation 到 On-Policy Rollout

为了解决训练分布与执行分布不一致的问题，研究者开始让模型在训练过程中执行自身策略，并收集由当前策略产生的轨迹：

$$
\begin{equation}
\tau
\sim
\pi_\theta.
\end{equation}
$$

一条轨迹可以写为：

$$
\begin{equation}
\tau
=
(
s_0,
a_0,
s_1,
a_1,
\ldots,
s_T
).
\end{equation}
$$

与离线专家数据不同，这些轨迹反映了模型实际会访问的状态分布，其中包括：

* 正确执行状态；
* 轻微偏差状态；
* 完全失败状态；
* 自主恢复状态；
* 训练数据中较少出现的新状态。

策略由此可以在自己的状态分布上继续学习：

$$
\begin{equation}
d_{\pi_\theta}
\rightarrow
\text{new training data}.
\end{equation}
$$

这种训练方式使 VLA 从纯 offline imitation learning 逐渐转向 online policy improvement。

最简单的做法是将成功 rollout 加入训练数据，并继续进行行为克隆。设当前策略生成一组轨迹：

$$
\begin{equation}
\mathcal B
=
{
\tau_1,\tau_2,\ldots,\tau_N
},
\end{equation}
$$

从中筛选任务成功或高质量轨迹：

$$
\begin{equation}
\mathcal B^+
=
{
\tau_i
\mid
R(\tau_i)>\delta
},
\end{equation}
$$

然后使用这些轨迹对策略进行微调：

$$
\begin{equation}
\mathcal D
\leftarrow
\mathcal D
\cup
\mathcal B^+.
\end{equation}
$$

这种方法可以被视为 self-training 或 filtered behavior cloning。模型不断生成新数据，再从中选择较好的行为用于训练。

它的优势是稳定，并且不一定需要显式计算策略梯度。对于难以获得 action likelihood 的 diffusion 或 flow-based policy，这种方式尤其方便。

但仅使用成功轨迹也存在限制。当当前策略成功率较低时，大部分 rollout 都会被丢弃，环境交互成本无法充分利用。此外，它仍然主要模仿筛选后的动作，而不是直接比较不同动作产生的长期结果。

因此，研究进一步引入强化学习。

### 强化学习目标

在强化学习中，机器人与环境交互，并根据动作产生的后果获得奖励。策略目标是最大化期望累计回报：

$$
\begin{equation}
J(\theta)
=
\mathbb E_{\tau \sim \pi_\theta}
\left[
\sum_{t=0}^{T}
\gamma^t r_t
\right],
\end{equation}
$$

其中：

* ($r_t$) 表示时间步 ($t$) 的奖励；
* ($\gamma \in [0,1]$) 表示折扣因子；
* ($T$) 表示任务长度。

强化学习不要求策略复现某条固定专家轨迹。只要某种行为能够获得较高回报，它就可以被保留和强化。

因此，强化学习优化的是：

$$
\begin{equation}
\text{what actually works},
\end{equation}
$$

而行为克隆优化的是：

$$
\begin{equation}
\text{what the expert did}.
\end{equation}
$$

这一区别允许策略发现与示范不同但同样有效，甚至更适合当前机器人和环境的动作。

对于已经完成行为克隆预训练的 VLA，强化学习通常不是从随机策略开始，而是在已有策略基础上进行 policy improvement：

$$
\begin{equation}
\pi_{\mathrm{BC}}
\rightarrow
\pi_{\mathrm{RL}}.
\end{equation}
$$

预训练策略提供基本任务能力，使 rollout 中能够出现部分成功或接近成功的行为；强化学习再利用环境反馈提高成功率、纠错能力和任务鲁棒性。

这一范式与大语言模型中的 pretraining 与 post-training 具有一定相似性。预训练负责获得广泛能力，后训练则根据特定反馈调整模型行为。

对于 VLA，可以写成：

$$
\begin{equation}
\text{large-scale robot pretraining}
+
\text{environment-based post-training}.
\end{equation}
$$

### Online RL 对 VLA 的主要作用

Online RL 在 VLA 中通常承担几个不同功能。

第一，提升任务成功率。

行为克隆可能已经能够产生接近正确的动作，但在部分关键阶段仍然失败。强化学习可以根据最终成功信号调整策略，使其更加关注真正影响任务结果的动作。

第二，提高失败恢复能力。

由于 online rollout 会自然产生各种偏差状态，模型可以学习在这些状态下重新规划。例如，当第一次抓取失败时，模型可以尝试新的抓取姿态；当导航偏离目标时，可以重新定位。

第三，适应特定环境和机器人。

通用 VLA 需要覆盖多种机器人和任务，因此预训练策略可能无法在每个具体平台上达到最佳性能。Online RL 可以利用目标环境中的交互数据进行适配：

$$
\begin{equation}
\pi_{\mathrm{general}}
\rightarrow
\pi_{\mathrm{task-specific}}.
\end{equation}
$$

第四，提高接触和动力学鲁棒性。

机器人数据中的物理条件通常有限，而实际环境中摩擦、物体质量、关节阻尼和接触状态可能变化。通过在不同动力学条件下 rollout，强化学习可以提高策略对这些变化的适应能力。

第五，学习长程 credit assignment。

最终任务成功可能由早期某个关键决策决定。强化学习通过 value function、advantage 或轨迹级奖励，尝试将最终结果反馈到前面的动作选择中，而行为克隆只能逐步拟合专家动作。

因此，Online RL 并不是用于替代 VLA 预训练，而是补充行为克隆无法解决的闭环问题。

### 为什么不能直接从零使用 RL 训练 VLA

既然强化学习直接优化任务结果，一个自然问题是：为什么不完全放弃行为克隆，直接使用 RL 训练 VLA？

主要原因是探索难度和数据成本。

VLA 通常具有巨大的参数规模和高维连续动作空间。一个随机初始化的策略几乎不可能在复杂操作任务中偶然完成任务。如果奖励只在成功时出现，则随机策略获得正奖励的概率接近于零。

设随机策略单条轨迹成功概率为 ($p$)，采样 ($N$) 条轨迹后至少出现一次成功的概率为：

$$
\begin{equation}
1-(1-p)^N.
\end{equation}
$$

当 ($p$) 极小时，即使增加大量 rollout，也很难获得有效训练信号。

此外，机器人环境交互成本远高于语言模型中的 token 采样。每条轨迹都可能需要：

* 运行视觉语言模型推理；
* 执行物理仿真；
* 渲染相机观测；
* 模拟接触和碰撞；
* 重置环境；
* 在真实机器人上承担时间和硬件磨损。

因此，完全依赖 RL 从零学习通用机器人能力通常不可行。

更合理的方式是：

$$
\begin{equation}
\text{behavior cloning}
\rightarrow
\text{competent initial policy}
\rightarrow
\text{online RL refinement}.
\end{equation}
$$

行为克隆将策略带到具有一定成功率的区域，使 online rollout 能够产生有价值的轨迹；强化学习再针对策略自身的失败和环境反馈进行优化。

### VLA 中 Online RL 的基本训练循环

一个典型的 VLA online RL 过程可以写成四个阶段。

首先，使用当前策略在环境中生成 rollout：

$$
\begin{equation}
\tau_i
\sim
\pi_{\theta_k},
\qquad
i=1,\ldots,N.
\end{equation}
$$

其次，对每条轨迹计算奖励、成功标签或过程评分：

$$
\begin{equation}
R_i
=
R(\tau_i).
\end{equation}
$$

然后，根据奖励估计轨迹或动作的优势：

$$
\begin{equation}
A_t
=
Q(s_t,a_t)-V(s_t).
\end{equation}
$$

最后，使用这些信号更新策略：

$$
\begin{equation}
\theta_{k+1}
=
\theta_k
+
\eta
\hat{\nabla}_\theta J(\theta_k),
\end{equation}
$$

其中 ($\eta$) 表示学习率。

整个过程不断循环：

$$
\begin{equation}
\pi_{\theta_k}
\rightarrow
\text{rollout}
\rightarrow
\text{reward/value estimation}
\rightarrow
\pi_{\theta_{k+1}}.
\end{equation}
$$

随着策略更新，后续 rollout 的状态分布也会变化。模型由此不断在自己最新的行为分布上收集数据和提高性能。

### 从结果监督到过程监督

对于短程任务，最终成功奖励可能已经足够。例如，机器人成功抓起物体得到 ($1$)，失败得到 ($0$)。

但在长程任务中，仅使用最终二值奖励通常过于稀疏。一个任务可能持续数百个控制步，并包含多个阶段。如果只有完成全部任务才能得到奖励，那么绝大多数 rollout 的回报都是：

$$
\begin{equation}
R(\tau)=0.
\end{equation}
$$

此时，完全失败和接近成功的轨迹无法区分。

例如，以下两条轨迹可能得到相同的零奖励：

1. 机器人没有找到目标物体；
2. 机器人成功找到并抓取物体，但在最终放置时失败。

显然，第二条轨迹包含了更多有价值的行为。如果训练系统将二者完全视为相同，便浪费了大量过程信息。

因此，VLA 的 online RL 逐渐从只依赖最终结果，转向结合过程监督：

$$
\begin{equation}
R(\tau)
=
R_{\mathrm{final}}
+
R_{\mathrm{progress}}
+
R_{\mathrm{stage}}
+
R_{\mathrm{interaction}}.
\end{equation}
$$

其中：

* ($R_{\mathrm{final}}$) 表示最终任务成功；
* ($R_{\mathrm{progress}}$) 表示任务进度；
* ($R_{\mathrm{stage}}$) 表示子任务完成情况；
* ($R_{\mathrm{interaction}}$) 表示抓取、接触或物体运动等局部结果。

通过过程奖励，模型可以从失败轨迹中学习哪些动作推动了任务进展，哪些动作导致了错误。

### Online RL 带来的新问题

Online RL 虽然能够解决行为克隆的部分局限，但也引入了新的挑战。

第一，奖励设计困难。手工奖励过于简单会导致信号稀疏，过于复杂又可能产生 reward hacking。模型可能学会最大化奖励函数中的代理指标，却不真正完成任务。

第二，训练稳定性较差。VLA 参数规模大，策略更新可能破坏原有能力。强化学习在提高特定任务表现的同时，可能造成 catastrophic forgetting，使模型失去部分预训练能力。

第三，rollout 成本极高。每次策略更新都需要收集新的环境轨迹，而长程任务中的单条轨迹本身就非常昂贵。

第四，flow-based 或 diffusion-based VLA 不容易直接使用传统 policy gradient 方法。许多强化学习算法需要显式计算动作概率：

$$
\begin{equation}
\log \pi_\theta(a_t \mid s_t),
\end{equation}
$$

但生成式动作模型通常通过多步去噪或 ODE 积分产生动作，其显式 likelihood 并不容易获得。

第五，长程任务中的 reward assignment 仍然困难。即使获得最终奖励，也需要判断哪些时间步真正导致成功或失败。

这些问题说明，从行为克隆转向 online RL 并不是简单地在 VLA 后面加入一个奖励函数，而是需要重新设计数据生成、轨迹评价和策略更新方式。

尤其对于 diffusion 和 flow-based VLA，一个关键技术问题逐渐变得突出：

> 当策略不再直接输出一个显式概率分布，而是通过生成过程产生连续 action chunk 时，传统 PPO 或 GRPO 所依赖的 action log-likelihood 应该如何定义和计算？

这一问题推动研究者探索适合生成式 VLA 的强化学习方法。






## 面向生成式 VLA 的强化学习方法

传统强化学习算法通常假设策略能够显式给出动作概率。对于离散策略，模型直接输出每个动作的概率；对于连续高斯策略，模型则输出动作分布的均值和方差。

例如，一个高斯策略可以写为：

$$
\begin{equation}
\pi_\theta(a_t \mid s_t)
=
\mathcal N
\left(
a_t;
\mu_\theta(s_t),
\Sigma_\theta(s_t)
\right).
\end{equation}
$$

在这种情况下，给定状态 ($s_t$) 和动作 ($a_t$)，可以直接计算：

$$
\begin{equation}
\log \pi_\theta(a_t \mid s_t).
\end{equation}
$$

这使得策略梯度算法能够判断，当前策略应该提高还是降低某个动作的概率。

对于一条轨迹：

$$
\begin{equation}
\tau
=
(s_0,a_0,s_1,a_1,\ldots,s_T),
\end{equation}
$$

经典策略梯度可以写为：

$$
\begin{equation}
\nabla_\theta J(\theta)
=
\mathbb E_{\tau \sim \pi_\theta}
\left[
\sum_t
\nabla_\theta
\log
\pi_\theta(a_t \mid s_t)
A_t
\right],
\end{equation}
$$

其中 ($A_t$) 表示当前动作相对于平均行为的优势。

如果 ($A_t>0$)，说明该动作产生的结果好于预期，模型应提高其概率；如果 ($A_t<0$)，则应降低其概率。

PPO 在此基础上进一步限制每次策略更新的幅度。设 rollout 由旧策略 ($\pi_{\theta_{\mathrm{old}}}$) 生成，当前策略为 ($\pi_\theta$)，概率比定义为：

$$
\begin{equation}
r_t(\theta)
=
\frac{
\pi_\theta(a_t \mid s_t)
}{
\pi_{\theta_{\mathrm{old}}}(a_t \mid s_t)
}.
\end{equation}
$$

PPO 的 clipped objective 可以写为：

$$
\begin{equation}
\mathcal L_{\mathrm{PPO}}
=
\mathbb E
\left[
\min
\left(
r_t(\theta)A_t,
\operatorname{clip}
(
r_t(\theta),
1-\epsilon,
1+\epsilon
)
A_t
\right)
\right].
\end{equation}
$$

这种设计能够避免策略在一次更新中发生过大变化，从而提高训练稳定性。

类似地，GRPO 等方法也需要比较不同样本或轨迹的相对回报，并利用动作的 log probability 更新策略。

但对于 diffusion 或 flow-based VLA，动作并不是由一个显式高斯分布直接采样得到的。模型首先采样随机噪声，再通过多步生成过程将噪声转换为动作。

因此，最终动作 ($A$) 可以写成：

$$
\begin{equation}
A
=
G_\theta(\epsilon,x),
\end{equation}
$$

其中：

* ($\epsilon$) 表示初始随机噪声；
* ($x$) 表示视觉观测、机器人状态和语言指令；
* ($G_\theta$) 表示完整的 diffusion 或 flow 采样过程。

这种策略虽然可以生成动作样本，但通常不能像高斯策略一样简单地写出：

$$
\begin{equation}
\pi_\theta(A \mid x).
\end{equation}
$$

这使得传统 policy gradient 难以直接应用。

### Diffusion Policy 中的动作概率

在 diffusion policy 中，最终动作由一系列去噪状态产生：

$$
\begin{equation}
A_K
\rightarrow
A_{K-1}
\rightarrow
\cdots
\rightarrow
A_0,
\end{equation}
$$

其中 ($A_K$) 通常是高斯噪声，($A_0$) 是最终动作。

如果将每个去噪步骤都视为一个条件概率，则完整生成轨迹的概率可以写成：

$$
\begin{equation}
p_\theta
(
A_{0:K}
\mid x
)
=
p(A_K)
\prod_{k=1}^{K}
p_\theta
(
A_{k-1}
\mid
A_k,x
).
\end{equation}
$$

理论上，可以基于整条去噪轨迹计算 log probability：

$$
\begin{equation}
\log
p_\theta
(
A_{0:K}
\mid x
)
=
\log p(A_K)
+
\sum_{k=1}^{K}
\log
p_\theta
(
A_{k-1}
\mid A_k,x
).
\end{equation}
$$

但是，强化学习真正关心的是最终动作 ($A_0$) 的边缘概率：

$$
\begin{equation}
p_\theta(A_0 \mid x),
\end{equation}
$$

而不是某一条特定去噪路径的联合概率。由于同一个最终动作可能对应多条不同的噪声和去噪轨迹，需要对所有潜在路径积分：

$$
\begin{equation}
p_\theta(A_0 \mid x)
=
\int
p_\theta
(
A_{0:K}
\mid x
)
,dA_{1:K}.
\end{equation}
$$

这一积分通常难以精确计算。

因此，研究者有时会将扩散去噪过程本身视为一个多步决策过程，并对每个去噪步骤施加强化学习更新。但这样做会显著增加 horizon。原本机器人环境中的一个 action chunk，现在又被分解为多个去噪步骤。

完整训练过程将同时包含两种时间尺度：

$$
\begin{equation}
\text{environment time}
\times
\text{denoising time}.
\end{equation}
$$

如果机器人任务有 ($T$) 个环境决策步，每个动作生成需要 ($K$) 个去噪步，那么一次轨迹中涉及的生成决策数量大约为：

$$
\begin{equation}
T K.
\end{equation}
$$

这不仅增加计算成本，也使 credit assignment 更加困难。最终环境奖励需要同时反馈给多个机器人动作和每个动作内部的多个去噪步骤。

### Flow Policy 中的 Likelihood 问题

Flow-based policy 通过常微分方程将噪声分布变换为动作分布：

$$
\begin{equation}
\frac{dA_\tau}{d\tau}
=
v_\theta(A_\tau,\tau,x).
\end{equation}
$$

从理论上说，连续 normalizing flow 可以通过 instantaneous change-of-variables formula 计算概率密度变化：

$$
\begin{equation}
\frac{d \log p_\tau(A_\tau)}{d\tau}
=
\nabla_A
\cdot
v_\theta(A_\tau,\tau,x),
\end{equation}
$$

其中：

$$
\begin{equation}
\nabla_A
\cdot
v_\theta
\end{equation}
$$

表示速度场关于动作的散度。

对时间积分，可以得到最终动作概率：

$$
\begin{equation}
\log p_1(A_1 \mid x)
=
\log p_0(A_0)
\;-\;
\int_0^1
\nabla_A
\cdot
v_\theta(A_\tau,\tau,x)
\,d\tau.
\end{equation}
$$

这一公式表明，flow-based policy 并非在理论上完全没有 likelihood。但在实际大规模 VLA 中，动作 chunk 的维度可能很高，速度场又由大型 Transformer 建模，精确计算散度和积分成本很高。

一个长度为 ($H$)、单步动作维度为 ($D$) 的 action chunk 位于：

$$
\begin{equation}
\mathbb R^{H \times D}
\end{equation}
$$

空间中。对这样一个高维生成模型计算精确 Jacobian trace，往往需要大量额外前向和反向传播。

此外，实际 flow policy 采用有限步数的数值积分器。最终动作不仅依赖速度场，也依赖积分步数和求解器，因此理论概率与实际采样过程之间还可能存在偏差。

因此，在现代 VLA 中，直接为每一个生成动作计算精确 log probability 往往代价过高。

这形成了生成式 VLA 强化学习中的核心矛盾：

$$
\begin{equation}
\text{expressive generative policy}
\quad \text{vs.} \quad
\text{tractable policy likelihood}.
\end{equation}
$$

Diffusion 和 flow matching 提高了连续动作建模能力，却削弱了传统策略梯度所依赖的概率接口。

研究者因此开始探索不严格依赖精确 action likelihood 的优化方法。

### 将生成过程作为策略

第一类方法仍然尝试保留策略梯度框架，但不直接计算最终动作的精确概率，而是将生成过程中的中间状态视为策略决策。

对于 diffusion policy，可以将第 ($k$) 个去噪步骤写成：

$$
\begin{equation}
A_{k-1}
\sim
\pi_\theta
(
A_{k-1}
\mid
A_k,x,k
).
\end{equation}
$$

每一步去噪都相当于策略根据当前噪声动作选择下一个更干净的动作状态。整条去噪轨迹被视为一个内部 Markov decision process。

最终环境奖励 ($R$) 被用于更新所有去噪步骤：

$$
\begin{equation}
\nabla_\theta J
\approx
\mathbb E
\left[
R
\sum_{k=1}^{K}
\nabla_\theta
\log
\pi_\theta
(
A_{k-1}
\mid A_k,x,k
)
\right].
\end{equation}
$$

这种方法的优势是仍然可以使用 policy gradient 和 PPO-style clipping，也能够直接优化生成分布。

但它存在几个问题。

首先，去噪步骤本身没有独立环境奖励。同一个动作生成中的所有去噪步骤通常共享最终任务回报，因此 credit assignment 很粗糙。

其次，生成 horizon 被显著拉长。环境中的每个决策又包含多个内部决策，训练方差和显存成本都会增加。

再次，机器人任务的最终奖励可能来自多个 action chunks 之后。此时一个远期成功信号需要被分配给大量环境时间步和去噪时间步，优化难度很高。

因此，这类方法虽然理论上接近标准 RL，但在大规模、长程 VLA 中可能较为昂贵。

### Advantage-Weighted Behavior Cloning

第二类方法绕过精确策略概率比，不直接采用 PPO，而是将 RL 信号转化为带权重的监督学习。

假设当前策略生成轨迹，并为每个动作估计优势 ($A_t$)。可以通过优势决定该动作在行为克隆中的权重：

$$
\begin{equation}
w_t
=
\exp
\left(
\frac{A_t}{\beta}
\right),
\end{equation}
$$

其中 ($\beta$) 控制权重分布的尖锐程度。

策略更新目标可以写为：

$$
\begin{equation}
\mathcal L_{\mathrm{AWBC}}
=
-
\mathbb E
\left[
w_t
\log
\pi_\theta
(
a_t
\mid
s_t
)
\right].
\end{equation}
$$

对于不容易计算显式 log probability 的生成式策略，也可以直接对原有生成目标加权。例如，对于 flow matching，可以写成：

$$
\begin{equation}
\mathcal L_{\mathrm{weighted\text{-}FM}}
=
\mathbb E
\left[
w(\tau)
\left|
v_\theta(A_\tau,\tau,x)
-
v^\ast
\right|_2^2
\right].
\end{equation}
$$

高回报轨迹获得更高权重，低回报轨迹获得较低权重或被直接丢弃。

这种方法的核心思想是：

> 不必显式沿策略梯度提高动作概率，只需让模型更强地拟合高质量动作，较少拟合低质量动作。

它保留了行为克隆训练的稳定性，同时利用 reward、value 或 advantage 对数据进行重新加权。

对于已经具有较强初始能力的 VLA，这种方法通常比从头进行高方差 policy gradient 更稳定。模型只需要在已有动作分布附近向高回报区域移动，而不是大幅改变整个生成过程。

但 advantage-weighted behavior cloning 仍然具有保守性。它主要强化 rollout 中已经出现的好动作，难以主动将概率质量移向未采样到的新行为。如果当前策略从未生成成功动作，单纯加权已有样本也无法凭空发现新的成功模式。

### Filtered Fine-Tuning 与 Rejection Sampling

Advantage weighting 的一种更简单形式是轨迹筛选。

当前策略首先生成多个 rollout：

$$
\begin{equation}
\tau_1,\tau_2,\ldots,\tau_N.
\end{equation}
$$

根据任务回报、成功标签或 verifier score，筛选出高质量集合：

$$
\begin{equation}
\mathcal B^+
=
{
\tau_i
\mid
R(\tau_i)>\delta
}.
\end{equation}
$$

随后仅使用这些轨迹继续训练策略：

$$
\begin{equation}
\mathcal L_{\mathrm{FFT}}
=
\mathbb E_{\tau \sim \mathcal B^+}
\left[
\mathcal L_{\mathrm{gen}}(\tau)
\right].
\end{equation}
$$

其中 ($\mathcal L_{\mathrm{gen}}$) 可以是 token prediction、diffusion loss 或 flow matching loss。

如果每个相同任务或初始状态生成多个候选轨迹，还可以只保留其中表现最好的一部分：

$$
\begin{equation}
\mathcal B_{\mathrm{top}}
=
\operatorname{TopK}
\left(
{
\tau_i
}_{i=1}^{N}
\right).
\end{equation}
$$

这种方法可以被理解为 rejection sampling fine-tuning：

1. 从当前策略采样候选行为；
2. 拒绝低质量行为；
3. 使用保留行为更新策略。

它不需要计算复杂的策略概率，也不需要为每个动作估计精确 advantage，因此特别适合 diffusion 和 flow-based VLA。

这种方法在当前策略已经具有一定探索能力时非常有效。只要多个 rollout 中偶尔出现成功或较优轨迹，模型就可以逐渐提高这些行为的概率。

但 filtered fine-tuning 会浪费大量失败轨迹。在长程任务中，完整成功率可能较低，绝大多数昂贵 rollout 最终都不会进入训练集。即使一条轨迹已经完成大部分阶段，只在最后一步失败，也可能因为最终奖励为零而被整体丢弃。

这推动研究者进一步引入过程奖励、阶段评分和轨迹内部的部分筛选。

例如，可以保留成功完成的前缀：

$$
\begin{equation}
\tau_{0:t^\ast},
\end{equation}
$$

其中 ($t^\ast$) 表示失败发生前最后一个有效进展时间步。

也可以对不同子任务分别筛选：

$$
\begin{equation}
\mathcal B_k^+
=
{
\tau_i^{(k)}
\mid
R_k(\tau_i^{(k)})>\delta_k
}.
\end{equation}
$$

这样，即使整条长程任务失败，成功完成的导航、抓取或运输阶段仍然可以作为训练数据。

### 基于成对比较的偏好优化

环境反馈不一定能够给出准确的标量 reward，但通常更容易判断两条轨迹中哪一条更好。

给定相同任务条件 ($x$)，策略生成两条候选轨迹：

$$
\begin{equation}
\tau^+,
\qquad
\tau^-,
\end{equation}
$$

其中 ($\tau^+$) 的表现优于 ($\tau^-$)。

这种偏好可以来自：

* 最终任务成功与失败；
* 更高的任务进度；
* 更稳定的接触；
* 更短的完成时间；
* 人类判断；
* 自动 verifier；
* 仿真器中的状态指标。

策略优化目标不再要求准确知道每条轨迹值多少分，而只要求提高优选轨迹相对于劣选轨迹的概率。

一个抽象的偏好目标可以写为：

$$
\begin{equation}
\mathcal L_{\mathrm{pref}}
=
-
\log
\sigma
\left(
S_\theta(\tau^+,x)
-
S_\theta(\tau^-,x)
\right),
\end{equation}
$$

其中 ($S_\theta$) 表示策略对轨迹的隐式偏好分数。

对于具有显式 likelihood 的策略，分数可以由轨迹 log probability 构造；对于生成式 VLA，也可以训练额外的 reward model 或 ranking model，再使用其结果对生成损失进行加权。

偏好优化的优势是降低了 reward 设计要求。很多机器人任务很难设计精确连续奖励，但比较两条轨迹通常更容易。例如，一条轨迹成功抓住物体，另一条没有接触到物体，其优劣关系十分明确。

此外，相对比较对于不同任务尺度更加鲁棒。导航距离、抓取误差和放置稳定性可能具有不同量纲，但在同一任务下比较候选轨迹通常不需要统一绝对奖励尺度。

然而，偏好信号主要提供相对排序，并不能直接解释轨迹在哪个阶段出现问题。若仅使用整条轨迹偏好，长程 credit assignment 仍然存在。

### Reward Model 与 Verifier

为了自动评价大量 rollout，研究者开始训练 reward model 或 verifier。

Reward model 接收轨迹、观测或状态动作序列，并输出连续质量分数：

$$
\begin{equation}
\hat R_\phi(\tau)
=
f_\phi(\tau,l).
\end{equation}
$$

它可以根据少量人工标注、环境状态或轨迹偏好进行训练。训练完成后，reward model 能够为大量新轨迹快速打分，而不需要每次都由人工判断。

如果使用成对偏好数据，可以令 reward model 满足：

$$
\begin{equation}
P
(
\tau^+ \succ \tau^-
)
=
\sigma
\left(
\hat R_\phi(\tau^+)
-
\hat R_\phi(\tau^-)
\right).
\end{equation}
$$

对应损失为：

$$
\begin{equation}
\mathcal L_{\mathrm{RM}}
=
-
\log
\sigma
\left(
\hat R_\phi(\tau^+)
-
\hat R_\phi(\tau^-)
\right).
\end{equation}
$$

Verifier 则通常更关注某个明确条件是否成立。例如：

$$
\begin{equation}
V_\phi(\tau)
\in
{0,1},
\end{equation}
$$

可以表示：

* 任务是否成功；
* 是否完成某个子任务；
* 是否建立稳定抓取；
* 是否需要重新执行；
* 当前 rollout 是否可信。

Reward model 更像连续评价器，而 verifier 更像条件判断器。二者也可以结合：verifier 负责判断硬性成功条件，reward model 负责在失败或未完成轨迹之间比较进度。

对于长程 VLA，可以为每个阶段训练独立 verifier：

$$
\begin{equation}
V_\phi^{(k)}(\tau)
=
P
(
\text{subtask } k \text{ completed}
\mid
\tau
).
\end{equation}
$$

这样，系统不仅知道最终任务是否成功，还可以知道：

* 导航是否完成；
* 抓取是否稳定；
* 物体是否仍在夹爪中；
* 放置是否满足目标关系。

这种阶段化评价使失败轨迹能够提供更多训练信息。

### Value Function

Reward model 评价已经发生的轨迹，而 value function 预测从当前状态继续执行可能获得的未来回报：

$$
\begin{equation}
V_\psi(s_t,l)
=
\mathbb E_{\pi_\theta}
\left[
\sum_{k=t}^{T}
\gamma^{k-t}r_k
\mid
s_t,l
\right].
\end{equation}
$$

对于 action chunk policy，也可以定义 action-value function：

$$
\begin{equation}
Q_\psi(s_t,A_t,l)
=
\mathbb E
\left[
R
\mid
s_t,A_t,l
\right].
\end{equation}
$$

value function 可以用于多个方面。

第一，估计 advantage：

$$
\begin{equation}
A_t
=
Q_\psi(s_t,A_t,l)
-
V_\psi(s_t,l).
\end{equation}
$$

第二，在生成多个候选 action chunks 后进行选择：

$$
\begin{equation}
A_t^\ast
=
\arg\max_{A_t^{(i)}}
Q_\psi
(
s_t,A_t^{(i)},l
).
\end{equation}
$$

第三，在长程搜索中提前剪枝。如果某个中间状态的 value 很低，系统可以停止继续 rollout，从而节省仿真计算。

第四，判断当前任务是否仍然可恢复。如果状态价值已经显著下降，可以触发重置、回退或重新规划。

因此，value function 不仅服务于训练，也可以直接参与推理阶段的候选选择。

### Value-Guided Action Generation

生成式 VLA 能够从同一个状态采样多个不同 action chunks：

$$
\begin{equation}
A_t^{(1)},
A_t^{(2)},
\ldots,
A_t^{(N)}
\sim
\pi_\theta(\cdot \mid s_t,l).
\end{equation}
$$

value model 可以为每个候选动作预测未来质量：

$$
\begin{equation}
q_i
=
Q_\psi
(
s_t,A_t^{(i)},l
).
\end{equation}
$$

系统随后选择分数最高的动作：

$$
\begin{equation}
A_t^\ast
=
\arg\max_i q_i.
\end{equation}
$$

这种方法并不立即修改基础策略，而是在推理时通过采样和选择提高行为质量。

其基本逻辑是：

$$
\begin{equation}
\text{generation}
+
\text{evaluation}
+
\text{selection}.
\end{equation}
$$

这与语言模型中的 best-of-($N$) sampling 类似。策略负责生成多样候选，value model 或 verifier 负责从中选择更可能成功的行为。

对于多模态 action policy，这一方法尤其自然。随机噪声可以产生不同抓取姿态或运动方向，value model 再根据当前场景判断哪一个更合适。

如果单个候选成功概率为 ($p$)，并且候选之间具有一定独立性，那么生成 ($N$) 个候选后至少存在一个成功候选的概率为：

$$
\begin{equation}
1-(1-p)^N.
\end{equation}
$$

因此，增加候选数量可以提高找到优质动作的概率。

但这种提升依赖评价模型是否能够正确识别好动作。如果 value model 排序错误，即使候选集中存在成功行为，系统也可能选择失败候选。

因此，生成质量和评价质量共同决定最终结果：

$$
\begin{equation}
\text{final performance}
=
\text{candidate coverage}
\times
\text{selection accuracy}.
\end{equation}
$$

### 从 Policy Learning 到 Search-and-Learn

随着生成式 VLA、reward model、verifier 和 value function 的结合，机器人强化学习开始从单纯更新一个策略，逐渐转变为“生成、评价、筛选、再学习”的循环。

当前策略首先生成多个候选轨迹：

$$
\begin{equation}
\tau_i
\sim
\pi_{\theta_k},
\qquad
i=1,\ldots,N.
\end{equation}
$$

评价模块为轨迹打分：

$$
\begin{equation}
q_i
=
F
(
\tau_i
),
\end{equation}
$$

其中 ($F$) 可以是环境 reward、reward model、verifier 或 value function。

系统再选择高质量轨迹：

$$
\begin{equation}
\mathcal B_k^+
=
\operatorname{Select}
\left(
{
(\tau_i,q_i)
}_{i=1}^{N}
\right).
\end{equation}
$$

最后利用筛选结果更新策略：

$$
\begin{equation}
\theta_{k+1}
=
\operatorname{Update}
(
\theta_k,
\mathcal B_k^+
).
\end{equation}
$$

完整过程可以写为：

$$
\begin{equation}
\text{rollout}
\rightarrow
\text{evaluate}
\rightarrow
\text{select}
\rightarrow
\text{update}.
\end{equation}
$$

这种范式不再要求每次更新都严格遵循某一种经典 policy gradient。只要环境交互能够产生候选行为，评价模块能够识别更好的轨迹，生成模型就可以通过加权模仿、筛选微调或偏好学习逐步改进。

因此，对于现代 VLA，强化学习的含义开始变得更广。它不仅包括 PPO 式的策略梯度，也包括任何利用环境反馈改善策略的数据闭环。

从这一角度看，生成式 VLA 的 post-training 可以统一为：

$$
\begin{equation}
\text{policy-generated data}
+
\text{environment-grounded feedback}
\rightarrow
\text{policy improvement}.
\end{equation}
$$

### 不同优化方式的共同依赖

尽管这些方法在具体更新目标上不同，它们都依赖同一个前提：当前策略必须生成足够多且足够多样的 rollout。

如果只生成少量轨迹，可能根本无法发现成功行为；如果所有候选都高度相似，reward model 和偏好比较也无法提供有效差异；如果 rollout 覆盖不到关键失败状态，策略便无法学习恢复。

因此，无论采用：

* PPO；
* GRPO；
* advantage-weighted behavior cloning；
* filtered fine-tuning；
* preference optimization；
* reward-model-guided training；
* value-guided generation；

其性能最终都受到 rollout 数据质量和数量的限制。

可以将策略改进写成：

$$
\begin{equation}
\Delta J
=
F
(
N_{\mathrm{rollout}},
D_{\mathrm{rollout}},
Q_{\mathrm{feedback}},
E_{\mathrm{update}}
),
\end{equation}
$$

其中：

* ($N_{\mathrm{rollout}}$) 表示 rollout 数量；
* ($D_{\mathrm{rollout}}$) 表示轨迹多样性；
* ($Q_{\mathrm{feedback}}$) 表示评价信号质量；
* ($E_{\mathrm{update}}$) 表示策略更新效率。

过去的研究往往主要关注如何设计更好的 update objective，但随着 VLA 模型规模和任务 horizon 增加，rollout 本身逐渐成为主要计算瓶颈。

一条 VLA rollout 需要反复执行：

$$
\begin{equation}
\text{visual encoding}
+
\text{language-conditioned inference}
+
\text{action generation}
+
\text{environment simulation}.
\end{equation}
$$

对于长程 mobile manipulation，还需要持续进行图像渲染、物理接触模拟、导航和操作控制。每条轨迹都可能包含数百甚至数千个低层时间步。

因此，现代 VLA 强化学习进一步面对一个系统性问题：

> 在单条轨迹成本已经很高的情况下，如何获得足够多的候选 rollout，使采样、比较和策略改进真正产生 scaling 效应？

这推动研究重点从“如何利用 rollout 更新策略”，进一步转向“如何扩大 rollout 数量并提高单位计算量所产生的训练价值”，也就是 rollout scaling。



### 从策略优化到 Rollout Efficiency

尽管不同方法采用的更新目标不同，它们都依赖策略在环境中生成新的交互轨迹。无论是 PPO、GRPO、filtered fine-tuning，还是基于 reward model 和 value function 的训练，模型都需要通过 rollout 发现新的成功行为、失败状态和恢复过程。

因此，策略改进不仅取决于优化算法，也取决于训练过程中能够获得多少有效交互数据。可以将这一关系抽象地写为：

$$
\begin{equation}
\Delta J
=
F
(
N_{\mathrm{rollout}},
D_{\mathrm{rollout}},
Q_{\mathrm{feedback}},
E_{\mathrm{update}}
),
\end{equation}
$$

其中：

* ($N_{\mathrm{rollout}}$) 表示生成的轨迹数量；
* ($D_{\mathrm{rollout}}$) 表示轨迹的覆盖范围和多样性；
* ($Q_{\mathrm{feedback}}$) 表示奖励、verifier 或 value estimate 的准确性；
* ($E_{\mathrm{update}}$) 表示策略利用这些数据进行学习的效率。

增加 rollout 数量，可以提高模型发现成功行为或高质量行为的概率。假设单条轨迹成功的概率为 ($p$)，独立采样 ($N$) 条轨迹后，至少出现一条成功轨迹的概率为：

$$
\begin{equation}
P(\text{at least one success})
=
1-(1-p)^N.
\end{equation}
$$

这说明，在当前策略已经具备一定基础能力的情况下，扩大采样规模可能显著增加可用于训练的成功样本。即使完整任务仍然失败，更多 rollout 也能够覆盖不同阶段的失败状态，为 reward model、value function 和恢复策略提供更丰富的数据。

但机器人中的 rollout 与语言模型中的文本采样存在明显区别。语言模型生成一个 token 主要需要模型前向推理，而机器人 rollout 还必须让动作真正作用于环境。一次完整交互通常包含：

$$
\begin{equation}
\text{visual observation}
\rightarrow
\text{VLA inference}
\rightarrow
\text{action execution}
\rightarrow
\text{environment transition}.
\end{equation}
$$

在仿真环境中，这一过程涉及视觉渲染、物理计算、碰撞检测和接触求解；在真实机器人上，还受到控制频率、任务重置时间和硬件安全的限制。

对于长程 mobile manipulation，一条轨迹可能同时包含导航、目标搜索、抓取、运输和放置等多个阶段。随着任务 horizon 增长，单条 rollout 的时间和计算成本都会增加：

$$
\begin{equation}
C_{\mathrm{rollout}}
\approx
\sum_{t=1}^{T}
\left(
C_{\mathrm{perception}}
+
C_{\mathrm{policy}}
+
C_{\mathrm{action}}
+
C_{\mathrm{environment}}
\right).
\end{equation}
$$

其中 ($T$) 表示任务执行长度。

因此，简单增加 rollout 数量并不是没有代价的。更大的采样规模可以提升探索覆盖率，但也会迅速增加推理和环境交互成本。VLA 的 online learning 由此面临新的效率问题：

$$
\begin{equation}
\text{more interaction data}
\quad \text{vs.} \quad
\text{higher rollout cost}.
\end{equation}
$$

这使研究重点逐渐从单纯追求更大的策略模型，扩展到如何提高 rollout 的信息密度。一个有价值的 rollout 不一定必须完成整个任务，它也可以提供以下信息：

* 当前策略在哪个阶段失败；
* 哪些状态仍然具有恢复可能；
* 哪些动作产生了有效任务进展；
* 哪些候选行为明显优于其他行为；
* 哪些状态最值得继续探索或重新采样。

因此，现代 VLA 的训练效率不仅取决于每秒能够生成多少轨迹，也取决于每条轨迹能够提供多少有效监督。

这一问题通常被称为 rollout efficiency 或 interaction efficiency。其目标是在有限的环境交互预算下，尽可能提高策略获得的有效学习信号：

$$
\begin{equation}
\text{learning efficiency}
=
\frac{
\text{policy improvement}
}{
\text{rollout compute or environment interactions}
}.
\end{equation}
$$

围绕这一问题，现有研究主要从几个方向提高效率。

第一，使用并行环境同时生成多条轨迹，以提高单位时间内的交互吞吐量。

第二，使用 reward model、verifier 或 value function 对候选轨迹进行筛选，减少低质量数据进入训练过程。

第三，将长程任务分解为多个阶段，使失败轨迹中已经完成的子任务仍然能够被利用。

第四，通过提前终止明显失败或低价值的轨迹，避免继续消耗无效仿真资源。

第五，使用更高效的推理结构、动作表示和环境系统，降低单次策略调用与物理模拟的成本。

因此，当 VLA 进入 online learning 阶段后，研究问题不再只是：

> 应该使用哪一种强化学习目标更新策略？

还包括：

> 如何生成足够丰富的交互数据，并从有限 rollout 中提取尽可能多的有效训练信号？

从大规模行为克隆到 online RL，VLA 的扩展维度也随之发生变化。离线预训练主要依赖模型规模和数据规模：

$$
\begin{equation}
\text{model scaling}
+
\text{data scaling}.
\end{equation}
$$

而 online learning 还需要考虑环境交互规模：

$$
\begin{equation}
\text{model scaling}
+
\text{data scaling}
+
\text{rollout scaling}.
\end{equation}
$$

这里的 rollout scaling 并不只是盲目增加轨迹数量，而是围绕轨迹生成、并行执行、过程评价、候选筛选和数据复用建立更加高效的训练闭环。

这也构成了当前通用机器人学习中的重要开放问题：当 VLA 已经具备较强的视觉语言理解和基本动作能力后，如何以可承受的交互成本，让模型通过自身经验持续提高复杂任务中的成功率和鲁棒性。



## 从模仿人类经验到利用机器人自身经验

前面的 VLA 发展主要围绕模型结构、数据规模和动作表示展开。随着视觉语言主干、生成式 action expert 和大规模机器人数据逐渐成熟，VLA 已经能够掌握大量基本操作技能，并在一定程度上泛化到新的对象、语言指令和环境。

但这些能力大多仍然来自行为克隆。模型通过专家示范学习：

$$
\begin{equation}
\pi_\theta(a\mid o,l)
\approx
p_{\mathrm{data}}(a\mid o,l).
\end{equation}
$$

这意味着，模型所学习的行为总体上受到训练数据分布的约束。行为克隆可以让机器人复现数据中的成功经验，却不会主动判断哪些示范更优，也不会因为某种新行为在实际执行中获得更高成功率，就自动提高这种行为的概率。

因此，单纯扩大示范数据解决的是行为覆盖问题，而不是策略优化问题。

更准确地说，行为克隆的目标是最大化示范动作的似然：

$$
\begin{equation}
\mathcal L_{\mathrm{BC}}
=
-
\mathbb E_{(o,l,a)\sim\mathcal D}
\left[
\log \pi_\theta(a\mid o,l)
\right].
\end{equation}
$$

而真正希望优化的机器人目标是：

$$
\begin{equation}
J(\pi)
=
\mathbb E_{\tau\sim\pi}
\left[
R(\tau)
\right].
\end{equation}
$$

二者通常相关，但并不等价。

一条动作轨迹可能与人类示范不同，却具有更高成功率或更快完成速度；另一条轨迹可能在动作数值上非常接近示范，但由于抓取或接触中的微小误差最终失败。行为克隆只知道动作是否接近数据，而无法直接判断它在环境中是否有效。

这促使 VLA 开始从“学习人类已经做过的行为”，转向“利用机器人自己的执行经验继续改进”。

这一变化并不是简单地丢弃人类示范，而是改变数据闭环的来源。示范数据仍然用于提供初始能力，但策略开始在自己的状态分布中产生新轨迹，并根据这些轨迹的结果继续更新。训练过程由原来的：

$$
\begin{equation}
\text{demonstration}
\rightarrow
\text{behavior cloning}
\end{equation}
$$

扩展为：

$$
\begin{equation}
\text{demonstration}
\rightarrow
\text{initial policy}
\rightarrow
\text{on-policy experience}
\rightarrow
\text{policy improvement}.
\end{equation}
$$

这里的关键变化是，机器人数据不再只是训练前固定收集好的示范集合，而成为策略运行过程中不断产生的新经验。模型能够看到自己实际会进入的状态，包括成功状态、轻微偏差状态、完全失败状态以及恢复过程。相比只观察专家轨迹，这类数据更接近部署时的真实分布。

然而，机器人自身产生的数据并不总是高质量的。随着自主 rollout 增加，训练集中会同时出现成功轨迹、部分成功轨迹、低效动作、错误恢复和完全失败。如果继续使用普通行为克隆，无差别地拟合所有数据，模型可能同时学习好行为和坏行为。

因此，后续问题不再只是如何产生更多数据，而是：

> 如何让同一个 VLA 利用质量不同的数据，同时在推理时仍然生成高质量行为？

一种自然方式是引入行为上下文。模型在训练时不仅接收语言任务和视觉观测，还接收描述轨迹质量、执行方式和错误状态的条件变量。例如，这个条件可以表示轨迹是否成功、是否发生恢复、执行是否稳定、任务进度是否较高，或者当前数据来自示范、自动 rollout 还是人工纠正。

策略由原来的：

$$
\begin{equation}
\pi_\theta(a\mid o,l)
\end{equation}
$$

扩展为：

$$
\begin{equation}
\pi_\theta(a\mid o,l,c),
\end{equation}
$$

其中 ($c$) 表示行为上下文。

这样，模型可以在同一数据集中同时学习成功和失败行为，但知道这些行为分别对应什么质量条件。推理时，系统将上下文设置为高质量、稳定或无错误的条件，从而引导模型生成数据分布中更优的行为模式：

$$
\begin{equation}
c
\rightarrow
c_{\mathrm{high\text{-}quality}}.
\end{equation}
$$

这一思路使 VLA 能够从更加异质的数据中学习。失败轨迹不再只能被丢弃，因为它们仍然可以帮助模型理解环境、动作结果和错误模式；低质量自主数据也不再与高质量示范完全等价，而是通过条件信息被明确区分。

训练数据因此可以从单一示范集合扩展为多来源经验集合：

$$
\begin{equation}
\mathcal D
=
\mathcal D_{\mathrm{demo}}
\cup
\mathcal D_{\mathrm{success}}
\cup
\mathcal D_{\mathrm{failure}}
\cup
\mathcal D_{\mathrm{correction}}.
\end{equation}
$$

其中，不同数据不必被看作同质样本。高质量示范可以提供稳定行为模式，成功 rollout 可以提供当前策略已经发现的有效路径，失败轨迹可以暴露策略弱点，纠正数据则可以把失败状态连接到恢复动作。

除了行为质量条件，另一个重要方向是使用子目标降低长程任务难度。长程语言指令通常过于抽象，直接从当前观测生成完整动作容易混合任务理解、进度判断和低层控制。若模型能够先预测一个更具体的未来状态，再让动作策略去实现这个状态，控制问题会变得更局部。

视觉子目标是一种典型表示。给定当前观测和子任务，模型可以生成或选择一个未来目标图像：

$$
\begin{equation}
I_t^{\mathrm{goal}}
\sim
p_\phi
\left(
I^{\mathrm{goal}}
\mid
I_t,z_t
\right).
\end{equation}
$$

VLA 随后根据当前图像和目标图像生成动作：

$$
\begin{equation}
A_t
\sim
\pi_\theta
\left(
A_t
\mid
I_t,
I_t^{\mathrm{goal}},
z_t,s_t
\right).
\end{equation}
$$

视觉子目标将抽象语言任务转化为更具体的未来状态。例如，与其只告诉机器人“折叠衣服”，模型还可以给出衣服下一阶段应当呈现的视觉构型；与其只告诉机器人“把杯子放进水槽”，模型可以给出杯子应当出现在水槽附近或水槽内的目标状态。策略随后只需推断如何从当前状态移动到目标状态。

在这一条件下，动作预测近似变成一个 inverse dynamics 问题：

$$
\begin{equation}
(I_t,I_t^{\mathrm{goal}})
\rightarrow
A_t.
\end{equation}
$$

这里的 world model 并不一定负责在线枚举大量动作并预测每条动作的成功率。它更像是把语言目标和任务阶段翻译成一个可感知的未来状态，再由 VLA 预测实现该状态所需的动作。这样，高层语义推理和低层动作生成之间不再只通过离散技能标签连接，而是通过可视化的中间目标连接。

$$
\begin{equation}
\text{language goal}
\rightarrow
\text{subgoal state}
\rightarrow
\text{action chunk}.
\end{equation}
$$

综合来看，从模仿人类经验到利用机器人自身经验，核心并不是某一个单独模型结构，而是训练闭环的变化。VLA 先通过示范学习获得基础能力，再通过自身 rollout 发现分布偏移、失败状态和可改进行为；随后利用 reward、verifier、value function、质量条件或子目标表示，把这些经验转化为新的训练信号。

这一过程可以概括为：

$$
\begin{equation}
\text{demonstrate}
\rightarrow
\text{imitate}
\rightarrow
\text{roll out}
\rightarrow
\text{evaluate}
\rightarrow
\text{condition or filter}
\rightarrow
\text{improve}.
\end{equation}
$$

VLA 因此逐渐从一个静态的模仿学习模型，发展为能够利用多种知识来源、执行经验、质量反馈和未来状态提示的通用机器人系统。它不再只是复现数据集中已有的动作，而是开始围绕自己的实际执行结果建立持续改进机制。

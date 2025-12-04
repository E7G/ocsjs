import { OCSWorker, defaultAnswerWrapperHandler, $, createDefaultQuestionResolver } from '@ocsjs/core';
import { Project, Script, $el, $$el, $message, $ui } from 'easy-us';
import { CommonWorkOptions, playMedia } from '../utils';
import { CommonProject } from './common';
import { commonWork, simplifyWorkResult, optimizationElementWithImage } from '../utils/work';
import { workNotes } from '../utils/configs';
// import { $console } from './background';

const workPages: [string, string][] = [
	['作业页面', 'quiz'],
	['考试页面', 'exam']
];

const isWork = () => {
	return window.location.href.includes('homework');
};
// const isExam = () => {
// 	return window.location.href.includes('exam');
// };

export const ULearningProject = Project.create({
	name: '优学院',
	domains: ['ulearning.cn', 'ulearning.com.cn'],
	scripts: {
		study: new Script({
			name: '📚 课程学习',
			matches: [['视频学习', /learnCourse\.html/]],
			configs: {
				notes: {
					defaultValue: $ui.notes(['可用来看优学院视频而不用手动点击', '基于OCS框架重构', '未完善，暂时无法使用'])
						.outerHTML
				},
				playbackRate: {
					label: '播放倍速',
					attrs: {
						type: 'number',
						min: 0.5,
						max: 16,
						step: 0.5
					},
					defaultValue: 1.0
				},
				volume: {
					label: '初始音量',
					attrs: {
						type: 'number',
						min: 0,
						max: 1,
						step: 0.1
					},
					defaultValue: 0.5
				}
			},
			async oncomplete() {
				const player = await waitForVideoPlayer();
				const speedControl = new SpeedController(this.cfg.playbackRate);

				// 应用音量设置
				player.volume = this.cfg.volume;

				// 监听倍速配置变化
				this.onConfigChange('playbackRate', (rate) => {
					speedControl.applyTo(player);
				});

				// 监听音量配置变化
				this.onConfigChange('volume', (vol) => {
					player.volume = vol;
				});

				// 处理暂停后自动恢复
				player.addEventListener('pause', async () => {
					if (!player.ended) {
						await $.sleep(1000);
						playMedia(() => player.play());
					}
				});

				player.addEventListener('ended', () => {
					$message.success('视频播放完毕');
					navigateToNext();
				});

				speedControl.applyTo(player);
				playMedia(() => player.play());
			}
		}),

		work: new Script({
			name: '📝 作业考试',
			matches: workPages,
			configs: { notes: workNotes },
			async oncomplete() {
				commonWork(this, {
					workerProvider: (opt) => workOrExam(isWork() ? 'work' : 'exam', opt)
				});
			}
		})
	}
});

function workOrExam(
	type: 'work' | 'exam',
	{ answererWrappers, period, thread, answerSeparators, answerMatchMode }: CommonWorkOptions
) {
	$message.info(`开始${type === 'work' ? '作业' : '考试'}`);
	CommonProject.scripts.workResults.methods.init({
		questionPositionSyncHandlerType: 'uxy'
	});

	const titleTransform = (titles: (HTMLElement | undefined)[]) => {
		return titles
			.filter((t) => t?.innerText)
			.map((t) => t?.innerText)
			.join(',');
	};

	const worker = new OCSWorker({
		root: '.question-item',
		elements: {
			title: '.question-title',
			/**
			 * 兼容各种选项
			 *
			 * ul li .after 单选多选
			 * ul li label:not(.after) 判断题
			 * ul li textarea 填空题
			 */
			options: '.ul-radio__label,.ul-checkbox__label',
			type: '.gray'
		},
		thread: thread ?? 1,
		answerSeparators: answerSeparators.split(',').map((s) => s.trim()),
		answerMatchMode: answerMatchMode,
		/** 默认搜题方法构造器 */
		answerer: (elements, ctx) => {
			const title = titleTransform(elements.title);
			if (title) {
				const typeInput = elements.type[0] as HTMLElement;
				// const type = (typeInput ? getQuestionType(typeInput.innerText) : undefined) || 'unknown';
				// console.log(type);
				// if(type=='judgement') {
				// elements.options[0].innerText = '正确';
				// elements.options[1].innerText = '错误';
				// }
				// function getOptionText(option: HTMLElement) {
				// 	if (option.innerText=='' && option.innerHTML.includes('icon-zhengque')){
				// 		return '正确';
				// 	}else if (option.innerText=='' && option.innerHTML.includes('icon-cuowu1')){
				// 		return '错误';
				// 	} else {
				// 		return option.innerText;
				// 	}
				// }
				return CommonProject.scripts.apps.methods.searchAnswerInCaches(title, async () => {
					await $.sleep((period ?? 3) * 1000);
					return defaultAnswerWrapperHandler(answererWrappers, {
						type: (typeInput ? getQuestionType(typeInput.innerText) : undefined) || 'unknown',
						title,
						options: ctx.elements.options.map((o) => o.innerText /* getOptionText(o) */).join('\n')
					});
				});
			} else {
				throw new Error('题目为空，请查看题目是否为空，或者忽略此题');
			}
		},
		work: async (ctx) => {
			const { elements, searchInfos } = ctx;
			const typeInput = elements.type[0] as HTMLInputElement;
			const type = getQuestionType(typeInput.innerText);

			if (type && (type === 'completion' || type === 'multiple' || type === 'judgement' || type === 'single')) {
				const resolver = createDefaultQuestionResolver(ctx)[type];
				return await resolver(
					searchInfos,
					elements.options.map((option) => optimizationElementWithImage(option)),
					async (
						type: 'single' | 'multiple' | 'completion' | 'judgement' | undefined,
						answer: string,
						option: HTMLElement,
						ctx: any
					) => {
						// $modal.alert({
						// 	title: '已选择选项',
						// 	content: `已选择选项: ${option?.querySelector('label')?.innerText}`
						// });
						// console.log(option);
						// $console.log(option);

						// 如果存在已经选择的选项
						if (type === 'judgement' || type === 'single' || type === 'multiple') {
							if (option?.parentElement && $$el('[class*="is-checked"]', option.parentElement).length === 0) {
								option.click();
								await $.sleep(500);
							}
							// 处理单选和多选的通用逻辑
							// if (type === 'single' || type === 'multiple') {
							// 	const input = option?.querySelector('input[type="radio"], input[type="checkbox"]');
							// 	if (input && !(input as HTMLInputElement).checked) {
							// 		// 使用更精确的点击目标
							// 		const label = option?.querySelector('label');
							// 		if (label) {
							// 			label.click();
							// 			// 增加选项间间隔时间
							// 			await $.sleep(300);
							// 		}
							// 	}
							// }
						} else if (type === 'completion' && answer.trim()) {
							const text = option?.querySelector('textarea');
							const textareaFrame = option?.querySelector('iframe');
							if (text) {
								text.value = answer;
							}
							if (textareaFrame?.contentDocument) {
								textareaFrame.contentDocument.body.innerHTML = answer;
							}
							if (option?.parentElement?.parentElement) {
								/** 如果存在保存按钮则点击 */
								$el('[onclick*=saveQuestion]', option?.parentElement?.parentElement)?.click();
								await $.sleep(500);
							}
						}
					}
				);
			}

			return { finish: false };
		},

		/** 完成答题后 */
		onResultsUpdate(curr, _, res) {
			CommonProject.scripts.workResults.methods.setResults(simplifyWorkResult(res, titleTransform));

			if (curr.result?.finish) {
				CommonProject.scripts.apps.methods.addQuestionCacheFromWorkResult(simplifyWorkResult([curr], titleTransform));
			}
			CommonProject.scripts.workResults.methods.updateWorkStateByResults(res);
		},
		async onElementSearched(elements) {
			const typeInput = elements.type[0] as HTMLInputElement;
			const type = typeInput ? getQuestionType(typeInput.innerText) : undefined;

			/** 判断题转换成文字，以便于答题程序判断 */
			if (type === 'judgement') {
				elements.options.forEach((option, index) => {
					if (option.innerHTML.includes('icon-zhengque')) {
						option.innerText = '正确';
					} else if (option.innerHTML.includes('icon-cuowu1')) {
						option.innerText = '错误';
					}
				});
			}
		}
	});

	worker
		.doWork({ enable_debug: true })
		.then(() => {
			$message.info({ content: '作业/考试完成，请自行检查后保存或提交。', duration: 0 });
			worker.emit('done');
		})
		.catch((err) => {
			$message.error({ content: `作业/考试失败: ${err}`, duration: 0 });
		});

	return worker;
}

// 视频控制相关
class SpeedController {
	private speed: number = 1.0;

	constructor(private speedinput: number) {
		this.speed = speedinput;
	}

	applyTo(video: HTMLVideoElement) {
		video.playbackRate = this.speed;
		video.dispatchEvent(new Event('ratechange'));
	}
}

async function waitForVideoPlayer() {
	return new Promise<HTMLVideoElement>((resolve) => {
		const check = () => {
			const player = document.querySelector('video');
			if (player?.readyState === 4) resolve(player);
			else setTimeout(check, 500);
		};
		check();
	});
}

// 增强下一页按钮判断逻辑
async function navigateToNext() {
	const nextButton = document.querySelector<HTMLDivElement>('.next-page-btn');
	if (nextButton) {
		// 使用规范化文本比较
		const btnText = nextButton.innerText.replace(/\s/g, '').toLowerCase();
		if (btnText.includes('下一页') || btnText.includes('next')) {
			$message.success({ content: '下一页', duration: 0 });
			nextButton.click();
			await $.sleep(1000); // 增加页面加载等待时间
			return true;
		} else {
			// 完成全部任务
			$message.success({ content: '所有任务已完成', duration: 0 });
			return false;
		}
	}
	// document.querySelector<HTMLDivElement>(".next-page-btn")?.click();
}

/**
 * 优学院题目类型映射（包含匹配）：
 * 包含"单选题" -> single
 * 包含"多选题" -> multiple
 * 包含"判断题" -> judgement
 * 包含"连线题" -> line
 * 包含"完形填空" -> fill
 * 包含"阅读理解" -> reader
 * 包含特定题型关键词 -> completion
 */
function getQuestionType(
	val: string
): 'single' | 'multiple' | 'judgement' | 'completion' | 'line' | 'fill' | 'reader' | undefined {
	return val.includes('单选题')
		? 'single'
		: val.includes('多选题')
		? 'multiple'
		: val.includes('判断题')
		? 'judgement'
		: ['简答题', '填空题', '名词解释', '论述题', '计算题', '其他题', '分录题', '资料题'].some((t) => val.includes(t))
		? 'completion'
		: val.includes('连线题')
		? 'line'
		: val.includes('完形填空')
		? 'fill'
		: val.includes('阅读理解')
		? 'reader'
		: undefined;
}

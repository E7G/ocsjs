/** 长江雨课堂考试页题目根节点（排除答题卡等重复渲染） */
export function getYuketangExamQuestionRoots(): HTMLElement[] {
	const all = Array.from(document.querySelectorAll<HTMLElement>('.subject-item'));

	const withQuestionTitle = all.filter((el) => {
		const title = el.querySelector('.item-body h4.exam-font, .item-body > h4');
		return !!title?.textContent?.trim();
	});

	if (withQuestionTitle.length > 0 && withQuestionTitle.length < all.length) {
		return withQuestionTitle;
	}

	const withExercise = all.filter((el) => el.querySelector(':scope > .exercise-item, .exercise-item .item-body'));
	if (withExercise.length > 0 && withExercise.length < all.length) {
		return withExercise;
	}

	// 排除答题卡/侧边栏容器内的 subject-item
	const answerSheetSelectors =
		'.answer-card, .answerCard, .answer-sheet, .answerSheet, .sheet-card, .card-list, .left-bar, .aside-bar, .exam-aside, .answer-card-box';
	const inMainContent = all.filter((el) => !el.closest(answerSheetSelectors));
	if (inMainContent.length > 0 && inMainContent.length < all.length) {
		return inMainContent;
	}

	// 题号与题干重复时，保留内容更完整的一份（通常是正文区）
	const byKey = new Map<string, HTMLElement>();
	for (const el of all) {
		const typeText = el.querySelector('.item-type')?.textContent?.replace(/\s+/g, ' ').trim() || '';
		const titleText = el.querySelector('.item-body h4')?.textContent?.replace(/\s+/g, ' ').trim() || '';
		const key = `${typeText}::${titleText}`;
		const prev = byKey.get(key);
		if (!prev) {
			byKey.set(key, el);
			continue;
		}
		const richness = (node: HTMLElement) =>
			node.querySelectorAll('.list-unstyled-radio li, .list-unstyled-checkbox li').length +
			(node.querySelector('.ueditor-content') ? 10 : 0);
		byKey.set(key, richness(el) >= richness(prev) ? el : prev);
	}
	const deduped = Array.from(byKey.values());
	if (deduped.length > 0 && deduped.length < all.length) {
		return deduped;
	}

	// 整页重复渲染时，取后半部分（答题卡在前、试题在后）
	if (all.length >= 2 && all.length % 2 === 0) {
		const half = all.length / 2;
		const firstHalf = all.slice(0, half);
		const secondHalf = all.slice(half);
		const mirrored =
			firstHalf.length === secondHalf.length &&
			firstHalf.every(
				(el, i) =>
					el.querySelector('.item-type')?.textContent?.replace(/\s+/g, ' ').trim() ===
					secondHalf[i].querySelector('.item-type')?.textContent?.replace(/\s+/g, ' ').trim()
			);
		if (mirrored) {
			return secondHalf;
		}
	}

	return withQuestionTitle.length > 0 ? withQuestionTitle : all;
}

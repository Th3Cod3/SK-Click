if (document.querySelector(".fixed-top")) {
	document.body.style.paddingTop = document.querySelector(
		".fixed-top"
	).scrollHeight;
}

$(document).on("click", '[data-target="btn-division"]', async e => {
	let $currentTarget = e.currentTarget;
	let id = $currentTarget.dataset.id || "";
	let ajax = $currentTarget.dataset.ajax;

	divisionForm = new modalForm({
		sendData: { id, ajax },
		modalId: "division",
		apiDir: "division",
		modalTitle: "Add division"
	});
});

if (document.querySelector(".fixed-top")) {
	document.body.style.paddingTop = document.querySelector(
		".fixed-top"
	).scrollHeight;
}

$(document).on("click", '[data-target="btn-division"]', async e => {
	let $currentTarget = e.currentTarget;
	let id = $currentTarget.dataset.id || "";
	let ajax = $currentTarget.dataset.ajax;

	divisionForm = new modalForm(
		{
			sendData: { id, ajax },
			modalId: "division",
			apiDir: "division",
			modalTitle: "Add division"
		},
		{
			savedForm: (data, object) => {
				home.divisions.push(data.division);
				$(object.$modal).modal("hide");
				$(object.$modal).on("hidden.bs.modal", () => {
					$(object.$modal).remove();
				});
			}
		}
	);
});

$(document).on("click", '[data-target="btn-event"]', async e => {
	let $currentTarget = e.currentTarget;
	let id = $currentTarget.dataset.id || "";
	let division_id = $currentTarget.dataset.divisionId || "";
	let ajax = $currentTarget.dataset.ajax;

	eventForm = new modalForm(
		{
			sendData: { id, ajax, division_id },
			modalId: "event",
			apiDir: "event",
			modalTitle: "Add event"
		},
		{
			savedForm: (data, object) => {
				division.events.push(data.event);
				$(object.$modal).modal("hide");
				$(object.$modal).on("hidden.bs.modal", () => {
					$(object.$modal).remove();
				});
			}
		}
	);
});

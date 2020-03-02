let app = {
	templates: {}
};

app.templates.modalHTML = modalId => {
	return `
		<div class="modal fade" id="modal-${modalId}" tabindex="-1" role="dialog" aria-labelledby="modal-title" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h3 class="modal-title"></h3>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
					</div>
				</div>
			</div>
		</div>`;
};

/*
/* Obj options
/* |	modalId
/* |	modalSize (optional)
/* |	modalTitle
/* |	apiDir
/* |	apiDir
/* |	sendData
/* Func getForm(self)
/* Func getForm(data, form)
*/

function modalForm(
	options = {},
	callbacks = { getForm: undefined, savedForm: undefined }
) {
	self = this;
	self.options = options;
	self.callbacks = callbacks;
	document.body.insertAdjacentHTML(
		"afterbegin",
		app.templates.modalHTML(self.options.modalId)
	);
	self.$modal = document.getElementById(`modal-${self.options.modalId}`);
	if (self.options.modalSize) {
		$modal.querySelector(".modal-dialog").classList.add(self.options.modalSize);
	}
	self.$modalBody = self.$modal.querySelector(".modal-body");
	self.$modal.querySelector(".modal-title").innerText = self.options.modalTitle;

	$(self.$modal).modal("show");
	loadDataGET(self.options.apiDir, self.options.sendData).then(async data => {
		self.$modalBody.insertAdjacentHTML("beforeend", data.html);
		if (self.callbacks.getForm) {
			self.callbacks.getForm(self);
		}
		self.$submitButton = self.$modalBody.querySelector('button[type="submit"]');
		self.submitForm();
	});

	self.submitForm = () => {
		self.$modalBody.querySelector("form").addEventListener("submit", e => {
			e.preventDefault();
			self.$submitButton.disabled = true;
			self.options.sendData = {
				...self.options.sendData,
				...getFormData(e.currentTarget)
			};
			loadData(self.options.apiDir, self.options.sendData).then(data => {
				if (data.save) {
					if (self.callbacks.savedForm) {
						self.callbacks.savedForm(data, self);
					}
				} else {
					self.$submitButton.disabled = false;
				}
				if (data.error) {
					showError(data.error);
				}
			});
		});
	};
}

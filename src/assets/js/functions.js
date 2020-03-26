loadData = (request, sendData, alwaysCallback) => {
	return new Promise((response, reject) => {
		$.ajax({
			type: "POST",
			url: `${BASEURL}api/${request}`,
			data: sendData,
			dataType: "json"
		})
			.done(data => {
				response(data);
			})
			.fail((xhr, textStatus, errorThrown) => {
				errorHandler(xhr);
				reject();
			})
			.always(() => {
				if (alwaysCallback) {
					alwaysCallback();
				}
			});
	});
};

loadDataGET = (request, sendData, alwaysCallback) => {
	return new Promise((response, reject) => {
		$.ajax({
			type: "GET",
			url: `${BASEURL}api/${request}`,
			data: sendData,
			dataType: "json"
		})
			.done(data => {
				response(data);
			})
			.fail((xhr, textStatus, errorThrown) => {
				errorHandler(xhr);
				reject();
			})
			.always(() => {
				if (alwaysCallback) {
					alwaysCallback();
				}
			});
	});
};

const getValueById = id => {
	return document.getElementById(id) && document.getElementById(id).value;
};


// TODO makes this function a component
const showError = (error, $element) => {
	if (!$element) {
		$element = document.body;
	}
	for (var key in error) {
		let date = new Date();
		$element.insertAdjacentHTML(
			"afterbegin",
			`
		<div data-error-id="${date.getTime}" class="fixed-top container mt-3 alert alert-danger alert-dismissible fade show" role="alert" style="z-index: 10000">
			<strong>${key}</strong> ${error[key]}.
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
		`
		);
		let $alert = $element.querySelector(`[data-error-id="${date.getTime}"]`);
		setTimeout(() => {
			$($alert).alert("close");
		}, 5000);
	}
};

const errorHandler = xhr => {
	if (xhr.readyState === 4) {
		alert("System Error: It's an error on the system.");
	} else if (xhr.readyState === 0) {
		alert("Network Error: Check your internet connection.");
	} else {
		alert("Error: Unexpected error.");
	}
};

const getFormData = formElement => {
	let $formInputs = formElement.elements;
	let sendData = {};
	for (let i = 0; i < $formInputs.length; i++) {
		if (
			($formInputs[i].type === "radio" || $formInputs[i].type === "checkbox") &&
			$formInputs[i].checked
		) {
			sendData[$formInputs[i].name] = $formInputs[i].value;
		} else if (
			$formInputs[i].type != "radio" &&
			$formInputs[i].type != "checkbox"
		) {
			sendData[$formInputs[i].name] = $formInputs[i].value;
		}
	}
	return sendData;
};


const BASEURL = document.getElementById("BASE_URL").value
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
			})
			.always(() => {
				if(alwaysCallback) {
					alwaysCallback()
				}
			});
	});
}

const showError = (error, $element) => {
	if(!$element){
		$element = document.body;
	}
	let counter = Date.getTime();
	for(var key in error){
		$element.insertAdjacentHTML("afterbegin",
		`
		<div data-error-id="${counter}" class="fixed-top container mt-3 alert alert-danger alert-dismissible fade show" role="alert">
			<strong>${key}</strong> ${error[key]}.
			<button type="button" class="close" data-dismiss="alert" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
		`)
		counter++;
	}
	$alert = $element.querySelector(`[data-error-id="${counter}"]`);
	setTimeout(() => {
		$($alert).alert('close')
	}, 5000)
}

const errorHandler = (xhr) => {
	if(xhr.readyState === 4){
		alert("System Error: It's an error on the system.")
	}else if(xhr.readyState === 0){
		alert("Network Error: Check your internet connection.")
	}else{
		alert("Error: Unexpected error.")
	}
};
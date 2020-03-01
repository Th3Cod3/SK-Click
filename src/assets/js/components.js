Vue.component('formDivision', {
	delimiters: ["#{", "}"],
	data: function () {
		return {
			division: {
				name: "",
				description: ""
			}
		}
	},
	template: `
		<form v-on:submit="saveDivision">
			<div class="col-12">
				<div class="form-group">
					<label for="name"><h5>Name</h5></label>
					<input type="number" v-model="division.name" class="form-control" id="name" name="name" placeholder="Name">
				</div>
			</div>

			<div class="col-12">
				<div class="form-group">
					<label for="description"><h5>Description</h5></label>
					<input type="number" v-model="division.description" class="form-control" id="description" name="description" placeholder="Description">
				</div>
			</div>
		</form>
		`,
	methods: {
		saveDivision: function () {
			
		}
	}
})
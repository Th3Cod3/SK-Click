Vue.component("eventCard", {
	props: ["event"],
	delimiters: ["#{", "}"],
	data: function() {
		return {
			count: 0
		};
	},
	computed: {
		eventUrl: function() {
			return BASEURL + "event/" + this.event.id;
		}
	},
	// :href="eventUrl"
	template: `
		<a class="card border text-dark">
			<div class="card-header font-weight-bold">
				#{ event.name } | #{ event.venue }
			</div>
			<div class="card-body">
				<table class="table table-borderless table-sm">
					<tr>
						<th class="font-weight-bold">Event start:</th>
						<td class="text-right">#{ event.from_date }</td>
					</tr>
					<tr>
						<th class="font-weight-bold">Event end:</th>
						<td class="text-right">#{ event.to_date }</td>
					</tr>
					<tr>
						<th class="font-weight-bold">Printing:</th>
						<td class="text-right">#{ event.printing ? "Yes" : "No" }</td>
					</tr>
					<tr>
						<th class="font-weight-bold">USB:</th>
						<td class="text-right">#{ event.usb ? "Yes" : "No" }</td>
					</tr>
				</table>
			</div>
		</a>
	`
});

/***********************
 * DIVISION COMPONENTS
 ************************/

/*
/* DIVISION CARD
*/
Vue.component("divisionCard", {
	props: ["division"],
	delimiters: ["#{", "}"],
	data: function() {
		return {
			count: 0
		};
	},
	computed: {
		divisionUrl: function() {
			return BASEURL + "manage/" + this.division.url;
		}
	},
	template: `
		<a class="card bg-secondary text-white" :href="divisionUrl">
			<div class="card-header font-weight-bold">
				#{ division.name }
			</div>
			<div class="card-body">
				#{ division.description }
			</div>
		</a>
	`
});

/*
/* DIVISION LIST
*/
Vue.component("divisionsList", {
	delimiters: ["#{", "}"],
	data: function() {
		return {
			divisions: [],
			modalComponent: false
		};
	},
	computed: {
		divisionUrl: function() {
			return BASEURL + "manage/" + this.division.url;
		}
	},
	created: function() {
		let self = this;
		self.$emit("loading", false);
		loadData("divisions").then(data => {
			self.divisions = data.divisions;
			self.load = false;
			self.$emit("loading", false);
		});
	},
	methods: {
		closeModal: function() {
			this.modalComponent = false;
		},
		editDivision: function() {
			alert("pending");
		},
		deleteDivision: function() {
			alert("pending");
		},
		createDivision: function() {
			this.modalComponent = "divisionForm";
		},
		insertNewDivision: function(data) {
			this.divisions.push(data.division);
		}
	},
	template: `
	<div class="row">
		<div class="col-12">
			<button class="btn btn-success my-3 btn-block" @click="createDivision">
				<i class="fas fa-plus float-left" style="line-height: inherit" ></i> Create
			</button>
			<modal 
				v-if="modalComponent"
				:modal-info="{id: 'modal-divisions', title: 'Division'}"
				:component="modalComponent"
				@modalClosed="closeModal"
				@saved="insertNewDivision">
			</modal>
			<div class="py-1 px-2">
				<div class="row font-weight-bold">
					<div class="col-9 my-auto">
						Name
					</div>
					<div class="col-3 text-right">
						Options
					</div>
				</div>
			</div>
			<hr class="m-0 p-0 mb-1 border-dark">
			<div class="py-1 px-2 mb-1" v-for="division in divisions">
				<div class="row">
					<div class="col-9 my-auto font-weight-bold">
						#{ division.name }
					</div>
					<div class="col-3 text-right">
						<div class="btn-group btn-group-sm">
							<button class="btn btn-primary" @click="editDivision" disabled>
								<i class="fas fa-edit"></i> <span class="d-none d-md-inline">Edit</span>
							</button>
							<button class="btn btn-danger" @click="deleteDivision" disabled>
								<i class="fas fa-eraser"></i> <span class="d-none d-md-inline">Delete</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`
});

/*
/* DIVISION FORM
*/

Vue.component("divisionForm", {
	props: ["division"],
	delimiters: ["#{", "}"],
	data: function() {
		return {
			divisionModel: {
				name: "",
				description: ""
			},
			ajax: "new",
			loading: false
		};
	},
	methods: {
		saveDivision: function(e) {
			let self = this;
			e.preventDefault();
			self.loading = true;
			loadData("division", {
				...self.divisionModel,
				ajax: self.ajax
			}).then(data => {
				if (data.save) {
					self.$emit("saved", data);
				} else {
					self.loading = false;
				}
				if (data.error) {
					showError(data.error);
				}
			});
		}
	},
	template: `
	<form @submit="saveDivision">
		<div class="row">
			<div class="col-12">
				<div class="form-group">
					<label for="name">
						<h5>Name</h5>
					</label>
					<input type="text" v-model="divisionModel.name" class="form-control" placeholder="Name">
				</div>
			</div>

			<div class="col-12">
				<div class="form-group">
					<label for="description">
						<h5>Description</h5>
					</label>
					<input type="text" v-model="divisionModel.description" class="form-control" placeholder="Description">
				</div>
			</div>

			<div class="col-12">
				<button type="submit" class="btn btn-block btn-success" :disabled="loading">SAVE</button>
			</div>
		</div>
	</form>
	`
});

/***********************
 * PHOTOBOOTH TYPES COMPONENTS
 ************************/

/*
/* PHOTOBOOTH TYPES LIST
*/
Vue.component("boothTypesList", {
	delimiters: ["#{", "}"],
	data: function() {
		return {
			boothTypes: [],
			modalComponent: false
		};
	},
	created: function() {
		let self = this;
		self.$emit("loading", false);
		loadData("booth_types").then(data => {
			self.boothTypes = data.booth_types;
			self.load = false;
			self.$emit("loading", false);
		});
	},
	methods: {
		closeModal: function() {
			this.modalComponent = false;
		},
		editBoothType: function() {
			alert("pending");
		},
		deleteBoothType: function() {
			alert("pending");
		},
		newBoothType: function() {
			this.modalComponent = "boothTypeForm";
		},
		insertNewBoothType: function(data) {
			this.boothTypes.push(data.booth_type);
		}
	},
	template: `
	<div class="row">
		<div class="col-12">
			<button class="btn btn-success my-3 btn-block" @click="newBoothType">
				<i class="fas fa-plus float-left" style="line-height: inherit" ></i> New Photobooth
			</button>
			<modal 
				v-if="modalComponent"
				:modal-info="{id: 'modal-boothTypes', title: 'Photobooth type'}"
				:component="modalComponent"
				@modalClosed="closeModal"
				@saved="insertNewBoothType">
			</modal>
			<div class="py-1 px-2">
				<div class="row font-weight-bold">
					<div class="col-2 my-auto">
						Image
					</div>
					<div class="col-7 my-auto">
						Name
					</div>
					<div class="col-3 text-right">
						Options
					</div>
				</div>
			</div>
			<hr class="m-0 p-0 mb-1 border-dark">
			<div class="py-1 px-2 mb-1" v-for="boothType in boothTypes">
				<div class="row">
					<div class="col-2 my-auto font-weight-bold">
						<div v-if="boothType.image">
							<img :src="boothType.image" :alt="boothType.name + "-image""/>
						</div>
						<div v-else class=""><i class="far fa-images"></i></div>
					</div>
					<div class="col-7 my-auto font-weight-bold">
						#{ boothType.name }
					</div>
					<div class="col-3 text-right">
						<div class="btn-group btn-group-sm">
							<button class="btn btn-primary" @click="editBoothType" disabled>
								<i class="fas fa-edit"></i> <span class="d-none d-md-inline">Edit</span>
							</button>
							<button class="btn btn-danger" @click="deleteBoothType" disabled>
								<i class="fas fa-eraser"></i> <span class="d-none d-md-inline">Delete</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`
});

/*
/* PHOTOBOOTH TYPES FORM
*/

Vue.component("boothTypeForm", {
	props: ["boothType"],
	delimiters: ["#{", "}"],
	data: function() {
		return {
			boothTypeModel: {
				name: "",
				description: ""
			},
			ajax: "new",
			loading: false
		};
	},
	methods: {
		saveBoothType: function(e) {
			let self = this;
			e.preventDefault();
			self.loading = true;
			loadData("booth_type", {
				...self.boothTypeModel,
				ajax: self.ajax
			}).then(data => {
				if (data.save) {
					self.$emit("saved", data);
				} else {
					self.loading = false;
				}
				if (data.error) {
					showError(data.error);
				}
			});
		}
	},
	template: `
	<form @submit="saveBoothType">
		<div class="row">
			<div class="col-12">
				<div class="form-group">
					<label for="name">
						<h5>Name</h5>
					</label>
					<input type="text" v-model="boothTypeModel.name" class="form-control" placeholder="Name" required>
				</div>
			</div>

			<div class="col-12">
				<div class="input-group mb-3">
					<div class="input-group-prepend">
						<span class="input-group-text" id="photobooth_upload">Upload</span>
					</div>
					<div class="custom-file">
						<input type="file" class="custom-file-input" id="photobooth_image" name="image" aria-describedby="photobooth_upload" disabled>
						<label class="custom-file-label" for="photobooth_image">Choose file</label>
					</div>
				</div>
			</div>

			<div class="col-12">
				<button type="submit" class="btn btn-block btn-success" :disabled="loading">SAVE</button>
			</div>
		</div>
	</form>
	`
});

/***********************
 * BACKDROPS COMPONENTS
 ************************/

/*
/* BACKDROPS LIST
*/
Vue.component("backdropsList", {
	delimiters: ["#{", "}"],
	data: function() {
		return {
			backdrops: [],
			modalComponent: false
		};
	},
	created: function() {
		let self = this;
		self.$emit("loading", false);
		loadData("backdrops").then(data => {
			self.backdrops = data.backdrops;
			self.load = false;
			self.$emit("loading", false);
		});
	},
	methods: {
		closeModal: function() {
			this.modalComponent = false;
		},
		editBackdrop: function() {
			alert("pending");
		},
		deleteBackdrop: function() {
			alert("pending");
		},
		newBackdrop: function() {
			this.modalComponent = "backdropForm";
		},
		insertNewBackdrop: function(data) {
			this.backdrops.push(data.backdrop);
		}
	},
	template: `
	<div class="row">
		<div class="col-12">
			<button class="btn btn-success my-3 btn-block" @click="newBackdrop">
				<i class="fas fa-plus float-left" style="line-height: inherit" ></i> New Photobooth
			</button>
			<modal 
				v-if="modalComponent"
				:modal-info="{id: 'modal-backdrops', title: 'Photobooth type'}"
				:component="modalComponent"
				@modalClosed="closeModal"
				@saved="insertNewBackdrop">
			</modal>
			<div class="py-1 px-2">
				<div class="row font-weight-bold">
					<div class="col-2 my-auto">
						Image
					</div>
					<div class="col-7 my-auto">
						Name
					</div>
					<div class="col-3 text-right">
						Options
					</div>
				</div>
			</div>
			<hr class="m-0 p-0 mb-1 border-dark">
			<div class="py-1 px-2 mb-1" v-for="backdrop in backdrops">
				<div class="row">
					<div class="col-2 my-auto font-weight-bold">
						<div v-if="backdrop.image">
							<img :src="backdrop.image" :alt="backdrop.name + "-image""/>
						</div>
						<div v-else class=""><i class="far fa-images"></i></div>
					</div>
					<div class="col-7 my-auto font-weight-bold">
						#{ backdrop.name }
					</div>
					<div class="col-3 text-right">
						<div class="btn-group btn-group-sm">
							<button class="btn btn-primary" @click="editBackdrop" disabled>
								<i class="fas fa-edit"></i> <span class="d-none d-md-inline">Edit</span>
							</button>
							<button class="btn btn-danger" @click="deleteBackdrop" disabled>
								<i class="fas fa-eraser"></i> <span class="d-none d-md-inline">Delete</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`
});

/*
/* BACKDROPS FORM
*/

Vue.component("backdropForm", {
	props: ["backdrop"],
	delimiters: ["#{", "}"],
	data: function() {
		return {
			backdropModel: {
				name: "",
				description: ""
			},
			ajax: "new",
			loading: false
		};
	},
	methods: {
		saveBackdrop: function(e) {
			let self = this;
			e.preventDefault();
			self.loading = true;
			loadData("backdrop", {
				...self.backdropModel,
				ajax: self.ajax
			}).then(data => {
				if (data.save) {
					self.$emit("saved", data);
				} else {
					self.loading = false;
				}
				if (data.error) {
					showError(data.error);
				}
			});
		}
	},
	template: `
	<form @submit="saveBackdrop">
		<div class="row">
			<div class="col-12">
				<div class="form-group">
					<label for="name">
						<h5>Name</h5>
					</label>
					<input type="text" v-model="backdropModel.name" class="form-control" placeholder="Name" required>
				</div>
			</div>

			<div class="col-12">
				<div class="input-group mb-3">
					<div class="input-group-prepend">
						<span class="input-group-text" id="photobooth_upload">Upload</span>
					</div>
					<div class="custom-file">
						<input type="file" class="custom-file-input" id="photobooth_image" name="image" aria-describedby="photobooth_upload" disabled>
						<label class="custom-file-label" for="photobooth_image">Choose file</label>
					</div>
				</div>
			</div>

			<div class="col-12">
				<button type="submit" class="btn btn-block btn-success" :disabled="loading">SAVE</button>
			</div>
		</div>
	</form>
	`
});

/***********************
 * PROPS COMPONENTS
 ************************/

/*
/* PROPS LIST
*/
Vue.component("propsList", {
	delimiters: ["#{", "}"],
	data: function() {
		return {
			props: [],
			modalComponent: false
		};
	},
	created: function() {
		let self = this;
		self.$emit("loading", false);
		loadData("props").then(data => {
			self.props = data.props;
			self.load = false;
			self.$emit("loading", false);
		});
	},
	methods: {
		closeModal: function() {
			this.modalComponent = false;
		},
		editProp: function() {
			alert("pending");
		},
		deleteProp: function() {
			alert("pending");
		},
		newProp: function() {
			this.modalComponent = "propForm";
		},
		insertNewProp: function(data) {
			this.props.push(data.prop);
		}
	},
	template: `
	<div class="row">
		<div class="col-12">
			<button class="btn btn-success my-3 btn-block" @click="newProp">
				<i class="fas fa-plus float-left" style="line-height: inherit" ></i> New Photobooth
			</button>
			<modal 
				v-if="modalComponent"
				:modal-info="{id: 'modal-props', title: 'Photobooth type'}"
				:component="modalComponent"
				@modalClosed="closeModal"
				@saved="insertNewProp">
			</modal>
			<div class="py-1 px-2">
				<div class="row font-weight-bold">
					<div class="col-2 my-auto">
						Image
					</div>
					<div class="col-7 my-auto">
						Name
					</div>
					<div class="col-3 text-right">
						Options
					</div>
				</div>
			</div>
			<hr class="m-0 p-0 mb-1 border-dark">
			<div class="py-1 px-2 mb-1" v-for="prop in props">
				<div class="row">
					<div class="col-2 my-auto font-weight-bold">
						<div v-if="prop.image">
							<img :src="prop.image" :alt="prop.name + "-image""/>
						</div>
						<div v-else class=""><i class="far fa-images"></i></div>
					</div>
					<div class="col-7 my-auto font-weight-bold">
						#{ prop.name }
					</div>
					<div class="col-3 text-right">
						<div class="btn-group btn-group-sm">
							<button class="btn btn-primary" @click="editProp" disabled>
								<i class="fas fa-edit"></i> <span class="d-none d-md-inline">Edit</span>
							</button>
							<button class="btn btn-danger" @click="deleteProp" disabled>
								<i class="fas fa-eraser"></i> <span class="d-none d-md-inline">Delete</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`
});

/*
/* PROPS FORM
*/

Vue.component("propForm", {
	props: ["prop"],
	delimiters: ["#{", "}"],
	data: function() {
		return {
			propModel: {
				name: "",
				description: ""
			},
			ajax: "new",
			loading: false
		};
	},
	methods: {
		saveProp: function(e) {
			let self = this;
			e.preventDefault();
			self.loading = true;
			loadData("prop", {
				...self.propModel,
				ajax: self.ajax
			}).then(data => {
				if (data.save) {
					self.$emit("saved", data);
				} else {
					self.loading = false;
				}
				if (data.error) {
					showError(data.error);
				}
			});
		}
	},
	template: `
	<form @submit="saveProp">
		<div class="row">
			<div class="col-12">
				<div class="form-group">
					<label for="name">
						<h5>Name</h5>
					</label>
					<input type="text" v-model="propModel.name" class="form-control" placeholder="Name" required>
				</div>
			</div>

			<div class="col-12">
				<div class="input-group mb-3">
					<div class="input-group-prepend">
						<span class="input-group-text" id="photobooth_upload">Upload</span>
					</div>
					<div class="custom-file">
						<input type="file" class="custom-file-input" id="photobooth_image" name="image" aria-describedby="photobooth_upload" disabled>
						<label class="custom-file-label" for="photobooth_image">Choose file</label>
					</div>
				</div>
			</div>

			<div class="col-12">
				<button type="submit" class="btn btn-block btn-success" :disabled="loading">SAVE</button>
			</div>
		</div>
	</form>
	`
});

/***********************
 * MODAL COMPONENTS
 ************************/

/*
/* MODAL
*/
Vue.component("modal", {
	props: ["modalInfo", "component"],
	delimiters: ["#{", "}"],
	data: function() {
		return {};
	},
	created: function() {
		let self = this;
		setTimeout(() => {
			$(`#${self.modalInfo.id}`).modal("show");
			$(`#${self.modalInfo.id}`).on("hidden.bs.modal", () => {
				$(`#${self.modalInfo.id}`).off("hidden.bs.modal");
				self.$emit("modalClosed");
			});
		}, 1);
	},
	methods: {
		resendSavedData: function(data) {
			this.$emit("saved", data);
			$(`#${this.modalInfo.id}`).modal("hide");
		}
	},
	template: `
	<div class="modal fade" :id="modalInfo.id" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h3 class="modal-title">#{modalInfo.title}</h3>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body" v-if="component">
					<component :is="component" @saved="resendSavedData"></component>
				</div>
			</div>
		</div>
	</div>
	`
});

/***********************
 * UTILITIES COMPONENTS
 ************************/

/*
/* MODAL
*/

Vue.component("modal", {
	props: ["modalInfo"],
	delimiters: ["#{", "}"],
	data: () => ({}),
	created() {
		setTimeout(() => {
			$(`#${this.modalInfo.id}`).modal("show");
			$(`#${this.modalInfo.id}`).on("hidden.bs.modal", () => {
				$(`#${this.modalInfo.id}`).off("hidden.bs.modal");
				this.$emit("modalClosed");
			});
		}, 1);
	},
	methods: {
		closeModal() {
			$(`#${this.modalInfo.id}`).modal("hide");
		},
	},
	template: `
	<div class="modal fade" :id="modalInfo.id" tabindex="-1" role="dialog" aria-hidden="true">
		<div :class="{'modal-dialog': true, [modalInfo.size]: modalInfo.size ? true : false}" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h3 class="modal-title">#{modalInfo.title}</h3>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<slot></slot>
				</div>
			</div>
		</div>
	</div>
	`,
});

Vue.component("uploadFile", {
	props: ["file", "options"],
	delimiters: ["#{", "}"],
	data: () => ({
		name: "Select File"
	}),
	methods: {
		fileChange(event) {
			let file = event.target.files[0];
			if(file){
				this.name = file.name;
			}else{
				this.file = {};
				this.name = "Select File";
			}
			this.$emit("file-change", file);
		}
	},
	template: `
	<div class="input-group mb-3">
		<div class="input-group-prepend">
			<span class="input-group-text" id="photobooth_upload">Upload</span>
		</div>
		<div class="custom-file">
			<input type="file" class="custom-file-input" :id="options.id" @change="fileChange" :disabled="options.disabled">
			<label class="custom-file-label" :for="options.id">#{ name }</label>
		</div>
	</div>
	`,
});

/*
/* LOADER
*/

Vue.component("loader", {
	props: {
		loading: {},
		options: {
			Type: Object,
			default: () => {
				return {};
			},
		},
	},
	delimiters: ["#{", "}"],
	data: () => ({}),
	template: `
	<div v-if="loading">
		<div class="d-flex flex-column">
			<div class="d-block text-center">
				<div class="spinner-border text-dark" role="status">
					<span class="sr-only"></span>
				</div>
			</div>
			<div v-if="options.text" class="d-block text-center pt-2">
				#{ options.text }
			</div>
		</div>
	</div>
	`,
});

/*
/* TABS NAVIGATION BAR
*/

Vue.component("tabsNavbar", {
	props: ["active", "options"],
	delimiters: ["#{", "}"],
	data: () => ({}),
	methods: {
		clicked(selectedOption) {
			this.$emit("change-option", selectedOption);
		},
	},
	template: `
	<ul class="nav nav-tabs text-primary">
		<li v-for="option in options" class="nav-item">
			<span
				:class="{
					'nav-link': true,
					'active': active == option.active ? true : false,
					'disabled': option.disabled ? true : false
				}"
				@click="clicked(option.active)"
			>
				#{ option.name }
			</span>
		</li>
	</ul>
	`,
});

/*
/* DROPDOWN SEARCH
*/

Vue.component("dropdownSearch", {
	props: {
		items: {
			type: Array,
			required: true,
		},
		options: {
			type: Object,
			default: () => ({}),
		},
		disabled: {
			type: Boolean,
			required: false,
		},
	},
	delimiters: ["#{", "}"],
	data: () => ({
		id: "",
		value: "",
		selected: false,
		showOptions: false,
		activeItem: 0,
	}),
	methods: {
		updateValue() {
			if (this.items.length == 0) {
				this.value = "No options";
				this.$emit("input", "");
			} else {
				this.value = this.items[this.activeItem].name;
				this.$emit("input", this.items[this.activeItem].id);
			}
		},
		focus() {
			this.value = "";
			this.$emit("focus");
			this.showOptions = true;
			$(`#${this.options.id}`).dropdown("show");
		},
		blur() {
			this.updateValue();
			this.$emit("blur");
			this.showOptions = false;
			$(`#${this.options.id}`).dropdown("hide");
		},
		search(needle) {
			let result = needle.toLowerCase().match(this.value.toLowerCase());
			return result;
		},
		baseUrl() {
			return BASEURL;
		},
	},
	watch: {
		items() {
			this.updateValue();
		},
	},
	template: `
	<div class="form-group">
		<label v-if="options.label" :for="options.id">#{options.label}</label>
		<div class="dropdown">
			<input
				type="text"
				class="form-control"
				autocomplete="off"
				v-model="value"
				:id="options.id"
				:placeholder="options.placeholder"
				:disabled="disabled"
				@focus="focus"
				@blur="blur"
			/>
			<ul class="dropdown-menu" style="min-width: 100%">
				<li
					v-if="search(item.name)"
					v-for="(item, key) in items"
					:class="{
						'dropdown-item': true,
						'active': activeItem === key ? true : false
					}"
					@mouseenter="activeItem = key"
				>
					<span v-if="item.image">
						<img :src="baseUrl() + item.image_location" :alt="item.name + '-image'" class="img-dropdown-item"/>
					</span>
					<span v-else class=""><i class="far fa-images"></i></span>
					#{item.name}
				</li>
			</ul>
		</div>
	</div>
	`,
});

/***********************
 * EVENT COMPONENTS
 ************************/

/*
/* EVENT CARD
*/

Vue.component("eventCard", {
	props: ["event"],
	delimiters: ["#{", "}"],
	data: () => ({}),
	computed: {
		eventUrl() {
			return BASEURL + "event/" + this.event.id;
		},
	},
	methods: {
		editEvent() {
			alert("pending");
		},
		deleteEvent() {
			alert("pending");
		},
	},
	template: `
		<a class="card border text-dark">
			<div class="card-header font-weight-bold">
				#{ event.name } <small class="float-right">#{ event.ref_num }</small>
			</div>
			<div class="card-body">
				<table class="table table-borderless table-sm">
					<tr>
						<th class="font-weight-bold">Venue</th>
						<td class="text-right">#{ event.venue }</td>
					</tr>
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
				<div v-for="photobooth in event.event_photobooths" class="border p-2 mb-2">
					<table class="table table-borderless table-sm">
						<tr>
							<th class="font-weight-bold">Photobooth</th>
							<td class="text-right">#{ photobooth.photobooth.name }</td>
						</tr>
						<tr v-if="photobooth.division_backdrop_id">
						<th class="font-weight-bold">Backdrop</th>
						<td class="text-right">#{ photobooth.division_backdrop.backdrop.name }</td>
						</tr>
						<tr>
							<tr v-if="photobooth.photo_layer">* Custom photo layer</tr>
							<tr v-if="photobooth.touch_to_start">* Custom touch to start</tr>
						</tr>
					</table>
				</div>
			</div>
		</a>
	`,
});

/*
/* EVENT FORM
*/

Vue.component("eventForm", {
	props: ["event", "divisionId"],
	delimiters: ["#{", "}"],
	data: () => ({
		eventModel: {
			name: "",
			division_id: "",
			photobooths: [],
			usb: false,
			printing: false,
			from_date: "",
			to_date: "",
		},
		photobooths: [],
		backdrops: [],
		props: [],
		photobooth: "",
		ajax: "new",
		loading: false,
	}),
	created() {
		this.$emit("loading", true);
		this.loading = true;
		this.eventModel.division_id = this.divisionId;
		loadDataGET("photobooths", { division_id: this.divisionId }).then(
			(data) => {
				this.photobooths = data.photobooths;
				this.loading = false;
				this.$emit("loading", false);
			}
		);
		loadDataGET("division_backdrops", { division_id: this.divisionId }).then(
			(data) => {
				this.backdrops = data.backdrops;
				this.loading = false;
				this.$emit("loading", false);
			}
		);
		loadDataGET("division_props", { division_id: this.divisionId }).then(
			(data) => {
				this.props = data.props;
				this.loading = false;
				this.$emit("loading", false);
			}
		);
	},
	methods: {
		addPhotobooth() {
			photobooth = this.photobooths.filter((photobooth) => {
				return photobooth.id == this.photobooth;
			})[0];
			this.photobooths = this.photobooths.filter((photobooth) => {
				return photobooth.id != this.photobooth;
			});
			this.eventModel.photobooths.push({
				photobooth,
				props: [],
				backdrop: "",
				photo_layer: "",
				touch_to_start: "",
			});
		},
		saveEvent(e) {
			e.preventDefault();
			this.loading = true;
			loadData("event", {
				...this.eventModel,
				ajax: this.ajax,
			}).then((data) => {
				if (data.save) {
					this.$emit("saved", data);
				} else {
					this.loading = false;
				}
				if (data.error) {
					showError(data.error);
				}
			});
		},
	},
	watch: {
		backdrops() {
			this.backdrops.map((backdrop) => {
				backdrop.name = backdrop.backdrop.name;
				backdrop.image_location = backdrop.backdrop.image_location;
				delete backdrop.backdrop;
				return backdrop;
			});
		},
		props() {
			this.props.map((prop) => {
				prop.name = prop.prop.name;
				prop.image_location = prop.prop.image_location;
				delete prop.prop;
				return prop;
			});
		},
	},
	template: `
	<form @submit="saveEvent">
		<div class="row">
			<div class="col-12">
				<div class="form-group">
					<label for="name">
						<h5>Event name</h5>
					</label>
					<input type="text" class="form-control" v-model="eventModel.name" placeholder="Name" required>
				</div>
			</div>

			<div class="col-12">
				<div class="form-group">
					<label for="venue">
						<h5>Venue</h5>
					</label>
					<input type="text" class="form-control" v-model="eventModel.venue" placeholder="Venue" required>
				</div>
			</div>

			<div v-for="(photobooth, key) in eventModel.photobooths" class="col-12">
				<event-photobooth :photobooth="photobooth" :props="props" :backdrops="backdrops" :division-id="divisionId" :unique="key" />
			</div>

			<div class="col-12">
				<label for="photobooth-to-add">
					<h5>Add photobooth <small class="text-danger">at least one required</small></h5>
				</label>

				<div class="row">
					<div class="col-8">
						<dropdown-search
							:items="photobooths"
							:options="{
								id: 'photobooth-to-add',
								placeholder: 'Photobooth'
							}"
							:disabled="photobooths.length < 1"
							v-model="photobooth"
						/>
					</div>

					<div class="col-4">
						<button type="button" @click="addPhotobooth" class="btn btn-block btn-success" :disabled="photobooths.length < 1">Add Photobooth</button>
					</div>
				</div>
			</div>

			<div class="col-sm-12 col-md-6">
				<div class="form-check">
					<input type="checkbox" class="form-check-input" id="usb" v-model="eventModel.usb">
					<label class="form-check-label" for="usb">Include USB</label>
				</div>
			</div>

			<div class="col-sm-12 col-md-6">
				<div class="form-check">
					<input type="checkbox" class="form-check-input" id="printing" v-model="eventModel.printing">
					<label class="form-check-label" for="printing">Include unlimited printing</label>
				</div>
			</div>

			<div class="col-12">
				<div class="form-group">
					<label for="from_date">
						<h5>From</h5>
					</label>
					<input type="datetime-local" class="form-control" v-model="eventModel.from_date" required>
				</div>
			</div>

			<div class="col-12">
				<div class="form-group">
					<label for="to_date">
						<h5>To</h5>
					</label>
					<input type="datetime-local" class="form-control" v-model="eventModel.to_date" required>
				</div>
			</div>

			<input type="hidden" v-model="eventModel.division_id">

			<div class="col-12">
				<button type="submit" class="btn btn-block btn-success" :disabled="loading">SAVE</button>
			</div>
		</div>
	</form>
	`,
});

/*
/* EVENT CHOOSE PHOTOBOOTH
*/

Vue.component("eventPhotobooth", {
	props: ["photobooth", "props", "backdrops", "unique"],
	delimiters: ["#{", "}"],
	data: () => ({}),
	methods: {
		addProp() {},
	},
	template: `
		<div class="row border m-2 p-2">
			<div class="col-12">
				<h6>Photobooth: #{ photobooth.photobooth.name }</h6>
				<dropdown-search
					:items="backdrops"
					:options="{
						id: 'backdrop-' + unique,
						placeholder: 'Backdrop'
					}"
					:disabled="backdrops.length < 1"
					v-model="photobooth.backdrop"
				/>
			</div>
			
			<div class="col-sm-12 col-md-6">
				<div class="form-check">
					<input type="checkbox" class="form-check-input" :id="'photo_layer_' + unique" v-model="photobooth.photo_layer">
					<label class="form-check-label" :for="'photo_layer_' + unique">Custom photo layer</label>
				</div>
			</div>
			
			<div class="col-sm-12 col-md-6">
				<div class="form-check">
					<input type="checkbox" class="form-check-input" :id="'touch_to_start_' + unique" v-model="photobooth.touch_to_start">
					<label class="form-check-label" :for="'touch_to_start_' + unique">Custom touch to start</label>
				</div>
			</div>
		</div>
	`,
});

/*
/* EVENT CARD HOLDER
*/

Vue.component("eventCardHolder", {
	props: ["divisionId"],
	delimiters: ["#{", "}"],
	data: () => ({
		events: [],
		modalComponent: false,
	}),
	created() {
		this.$emit("loading", true);
		loadDataGET("events", { division_id: this.divisionId }).then((data) => {
			this.events = data.events;
			this.$emit("loading", false);
		});
	},
	methods: {
		closeModal() {
			this.modalComponent = false;
		},
		newEvent() {
			this.modalComponent = "eventForm";
		},
		insertNewEvent(data) {
			this.$refs.modalComponent.closeModal();
			this.events.push(data.event);
		},
	},
	template: `
	<div class="row">
		<div class="col-12 mb-3">
			<button class="btn btn-success btn-block" @click="newEvent">New event</button>
		</div>
		<modal
			ref="modalComponent"
			v-if="modalComponent"
			:modal-info="{id: 'modal-event', title: 'Event', size: 'modal-lg'}"
			@modalClosed="closeModal"
		>
			<event-form @saved="insertNewEvent" :division-id="divisionId" />
		</modal>
		<div class="col-md-6 col-sm-12 mb-3" v-for="event in events">
			<event-card :event="event">
			</event-card>
		</div>
	</div>
	`,
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
	data: () => ({}),
	computed: {
		divisionUrl() {
			return BASEURL + "division/" + this.division.url;
		},
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
	`,
});

/*
/* DIVISION LIST
*/
Vue.component("divisionsList", {
	delimiters: ["#{", "}"],
	data: () => ({
		divisions: [],
		modalComponent: false,
	}),
	computed: {
		divisionUrl() {
			return BASEURL + "division/" + this.division.url;
		},
	},
	created() {
		this.$emit("loading", true);
		loadDataGET("divisions").then((data) => {
			this.divisions = data.divisions;
			this.$emit("loading", false);
		});
	},
	methods: {
		closeModal() {
			this.modalComponent = false;
		},
		editDivision() {
			alert("pending");
		},
		deleteDivision() {
			alert("pending");
		},
		createDivision() {
			this.modalComponent = "divisionForm";
		},
		insertNewDivision(data) {
			this.$refs.modalComponent.closeModal();
			this.divisions.push(data.division);
		},
	},
	template: `
	<div class="row">
		<div class="col-12">
			<button class="btn btn-success my-3 btn-block" @click="createDivision">
				<i class="fas fa-plus float-left" style="line-height: inherit" ></i> Create
			</button>
			<modal
				ref="modalComponent" 
				v-if="modalComponent"
				:modal-info="{id: 'modal-divisions', title: 'Division'}"
				@modalClosed="closeModal"
			>
				<component :is="modalComponent" @saved="insertNewDivision"></component>
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
	`,
});

/*
/* DIVISION FORM
*/

Vue.component("divisionForm", {
	props: ["division"],
	delimiters: ["#{", "}"],
	data: () => ({
		divisionModel: {
			name: "",
			description: "",
		},
		ajax: "new",
		loading: false,
	}),
	methods: {
		saveDivision(e) {
			e.preventDefault();
			this.loading = true;
			loadData("division", {
				...this.divisionModel,
				ajax: this.ajax,
			}).then((data) => {
				if (data.save) {
					this.$emit("saved", data);
				} else {
					this.loading = false;
				}
				if (data.error) {
					showError(data.error);
				}
			});
		},
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
	`,
});

/***********************
 * PHOTOBOOTH COMPONENTS
 ************************/

/*
/* PHOTOBOOTH TYPES LIST
*/
Vue.component("boothTypesList", {
	delimiters: ["#{", "}"],
	data: () => ({
		boothTypes: [],
		modalComponent: false,
	}),
	created() {
		this.$emit("loading", true);
		loadDataGET("booth_types").then((data) => {
			this.boothTypes = data.booth_types;
			this.$emit("loading", false);
		});
	},
	methods: {
		closeModal() {
			this.modalComponent = false;
		},
		baseUrl() {
			return BASEURL;
		},
		editBoothType() {
			alert("pending");
		},
		deleteBoothType() {
			alert("pending");
		},
		newBoothType() {
			this.modalComponent = "boothTypeForm";
		},
		insertNewBoothType(data) {
			this.$refs.modalComponent.closeModal();
			this.boothTypes.push(data.booth_type);
		},
	},
	template: `
	<div class="row">
		<div class="col-12">
			<button class="btn btn-success my-3 btn-block" @click="newBoothType">
				<i class="fas fa-plus float-left" style="line-height: inherit" ></i> New Photobooth
			</button>
			<modal
				ref="modalComponent" 
				v-if="modalComponent"
				:modal-info="{id: 'modal-boothTypes', title: 'Photobooth'}"
				@modalClosed="closeModal"
			>
				<component :is="modalComponent" @saved="insertNewBoothType"></component>
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
						<div v-if="boothType.image_location">
							<img :src="baseUrl() + boothType.image_location" :alt="boothType.name + '-image'" class="img-thumbnail"/>
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
	`,
});

/*
/* PHOTOBOOTH TYPES FORM
*/

Vue.component("boothTypeForm", {
	props: ["boothType"],
	delimiters: ["#{", "}"],
	data: () => ({
		boothTypeModel: {
			name: "",
			description: "",
			image: {}
		},
		ajax: "new",
		loading: false,
	}),
	methods: {
		saveBoothType(e) {
			e.preventDefault();
			this.loading = true;
			let formData = new FormData();
			formData.set("name", this.boothTypeModel.name);
			formData.set("ajax", this.ajax);
			formData.set("image", this.boothTypeModel.image, this.boothTypeModel.image.name);
			loadDataMultipart("booth_type", formData).then((data) => {
				if (data.save) {
					this.$emit("saved", data);
				} else {
					this.loading = false;
				}
				if (data.error) {
					showError(data.error);
				}
			});
		},
		selectedFile(file) {
			this.boothTypeModel.image = file;
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
				<upload-file :options="{id: 'booth_image'}" @file-change="selectedFile" />
			</div>

			<div class="col-12">
				<button type="submit" class="btn btn-block btn-success" :disabled="loading">SAVE</button>
			</div>
		</div>
	</form>
	`,
});

/*
/* PHOTOBOOTH FORM
*/

Vue.component("photoboothForm", {
	props: ["photobooth", "divisionId"],
	delimiters: ["#{", "}"],
	data: () => ({
		photoboothModel: {
			name: "",
			booth_type_id: "",
			division_id: "",
		},
		boothTypes: [],
		ajax: "new",
		loading: false,
	}),
	created() {
		this.$emit("loading", true);
		loadDataGET("booth_types").then((data) => {
			this.boothTypes = data.booth_types;
			this.$emit("loading", false);
		});
		this.photoboothModel.division_id = this.divisionId;
	},
	methods: {
		savePhotobooth(e) {
			e.preventDefault();
			this.loading = true;
			loadData("photobooth", {
				...this.photoboothModel,
				ajax: this.ajax,
			}).then((data) => {
				if (data.save) {
					this.$emit("saved", data);
				} else {
					this.loading = false;
				}
				if (data.error) {
					showError(data.error);
				}
			});
		},
	},
	template: `
	<form @submit="savePhotobooth">
		<div class="row">
			<div class="col-12">
				<div class="form-group">
					<label for="name">
						<h5>Name</h5>
					</label>
					<input type="text" v-model="photoboothModel.name" class="form-control" placeholder="Name" required>
				</div>
			</div>
			
			<div class="col-12">
				<dropdown-search
					:items="boothTypes"
					:options="{
						label: 'Photobooth type',
						id: 'booth_type_id',
						placeholder: 'Photobooth type'
					}"
					:disabled="boothTypes.length < 1"
					v-model="photoboothModel.booth_type_id"
				/>
			</div>

			<input type="hidden" v-model="photoboothModel.division_id" />

			<div class="col-12">
				<button type="submit" class="btn btn-block btn-success" :disabled="loading">SAVE</button>
			</div>
		</div>
	</form>
	`,
});

/*
/* PHOTOBOOTH LIST
*/

Vue.component("photoboothList", {
	props: ["divisionId"],
	delimiters: ["#{", "}"],
	data: () => ({
		photobooths: [],
		modalComponent: false,
	}),
	created() {
		this.$emit("loading", true);
		console.log();
		loadDataGET("photobooths", { division_id: this.divisionId }).then(
			(data) => {
				this.photobooths = data.photobooths;
				this.$emit("loading", false);
			}
		);
	},
	methods: {
		closeModal() {
			this.modalComponent = false;
		},
		editPhotobooth() {
			alert("pending");
		},
		deletePhotobooth() {
			alert("pending");
		},
		baseUrl() {
			return BASEURL;
		},
		newPhotobooth() {
			this.modalComponent = true;
		},
		insertNewPhotobooth(data) {
			this.$refs.modalComponent.closeModal();
			this.photobooths.push(data.photobooth);
		},
	},
	template: `
	<div class="row">
		<div class="col-12">
			<button class="btn btn-success my-3 btn-block" @click="newPhotobooth">
				<i class="fas fa-plus float-left" style="line-height: inherit" ></i> New Photobooth
			</button>
			<modal
				ref="modalComponent"
				v-if="modalComponent"
				:modal-info="{
					id: 'modal-photobooth',
					title: 'Photobooth type'
				}"
				@modalClosed="closeModal"
			>
				<photobooth-form @saved="insertNewPhotobooth" :division-id="divisionId"></photobooth-form>
			</modal>
			<div class="py-1 px-2">
				<div class="row font-weight-bold">
					<div class="col-2 my-auto">
						Image
					</div>
					<div class="col-2 my-auto">
						Type
					</div>
					<div class="col-5 my-auto">
						Name
					</div>
					<div class="col-3 text-right">
						Options
					</div>
				</div>
			</div>
			<hr class="m-0 p-0 mb-1 border-dark">
			<div class="py-1 px-2 mb-1" v-for="photobooth in photobooths">
				<div class="row">
					<div class="col-2 my-auto font-weight-bold">
						<div v-if="photobooth.booth_type.image_location" >
							<img :src="baseUrl() + photobooth.booth_type.image_location" :alt="photobooth.name + '-image'" class="img-thumbnail"/>
						</div>
						<div v-else class=""><i class="far fa-images"></i></div>
					</div>
					<div class="col-2 my-auto font-weight-bold">
						#{ photobooth.booth_type.name }
					</div>
					<div class="col-5 my-auto font-weight-bold">
						#{ photobooth.name }
					</div>
					<div class="col-3 text-right">
						<div class="btn-group btn-group-sm">
							<button class="btn btn-primary" @click="editPhotobooth" disabled>
								<i class="fas fa-edit"></i> <span class="d-none d-md-inline">Edit</span>
							</button>
							<button class="btn btn-danger" @click="deletePhotobooth" disabled>
								<i class="fas fa-eraser"></i> <span class="d-none d-md-inline">Delete</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`,
});

/***********************
 * BACKDROPS COMPONENTS
 ************************/

/*
/* BACKDROPS LIST
*/

Vue.component("backdropsList", {
	delimiters: ["#{", "}"],
	data: () => ({
		backdrops: [],
		modalComponent: false,
	}),
	created() {
		this.$emit("loading", true);
		loadDataGET("backdrops").then((data) => {
			this.backdrops = data.backdrops;
			this.$emit("loading", false);
		});
	},
	methods: {
		closeModal() {
			this.modalComponent = false;
		},
		editBackdrop() {
			alert("pending");
		},
		deleteBackdrop() {
			alert("pending");
		},
		newBackdrop() {
			this.modalComponent = "backdropForm";
		},
		insertNewBackdrop(data) {
			this.$refs.modalComponent.closeModal();
			this.backdrops.push(data.backdrop);
		},
		baseUrl() {
			return BASEURL;
		},
	},
	template: `
	<div class="row">
		<div class="col-12">
			<button class="btn btn-success my-3 btn-block" @click="newBackdrop">
				<i class="fas fa-plus float-left" style="line-height: inherit" ></i> New Backdrop
			</button>
			<modal
				ref="modalComponent"
				v-if="modalComponent"
				:modal-info="{id: 'modal-backdrops', title: 'Backdrop'}"
				@modalClosed="closeModal"
			>
				<component :is="modalComponent" @saved="insertNewBackdrop"></component>
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
						<div v-if="backdrop.image_location">
							<img :src="baseUrl() + backdrop.image_location" :alt="backdrop.name + '-image'" class="img-thumbnail"/>
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
	`,
});

/*
/* BACKDROPS FORM
*/

Vue.component("backdropForm", {
	props: ["backdrop"],
	delimiters: ["#{", "}"],
	data: () => ({
		backdropModel: {
			name: "",
			image: {}
		},
		ajax: "new",
		loading: false,
	}),
	methods: {
		saveBackdrop(e) {
			e.preventDefault();
			this.loading = true;
			let formData = new FormData();
			formData.set("name", this.backdropModel.name);
			formData.set("ajax", this.ajax);
			formData.set("image", this.backdropModel.image, this.backdropModel.image.name);
			loadDataMultipart("backdrop", formData ).then((data) => {
				if (data.save) {
					this.$emit("saved", data);
				} else {
					this.loading = false;
				}
				if (data.error) {
					showError(data.error);
				}
			});
		},
		selectedFile(file) {
			this.backdropModel.image = file;
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
				<upload-file @file-change="selectedFile" :options="{id: 'backdrop_image'}" />
			</div>

			<div class="col-12">
				<button type="submit" class="btn btn-block btn-success" :disabled="loading">SAVE</button>
			</div>
		</div>
	</form>
	`,
});

/*
/* BACKDROPS IN DIVISION
*/

Vue.component("backdropsDivisionList", {
	props: ["divisionId"],
	delimiters: ["#{", "}"],
	data: () => ({
		backdrops: [],
		modalComponent: false,
	}),
	created() {
		this.$emit("loading", true);
		loadDataGET("division_backdrops", { division_id: this.divisionId }).then(
			(data) => {
				this.backdrops = data.backdrops;
				this.$emit("loading", false);
			}
		);
	},
	methods: {
		closeModal() {
			this.modalComponent = false;
		},
		editBackdrop() {
			alert("pending");
		},
		deleteBackdrop() {
			alert("pending");
		},
		newBackdrop() {
			this.modalComponent = "backdropDivisionForm";
		},
		insertNewBackdrop(data) {
			this.$refs.modalComponent.closeModal();
			this.backdrops.push(data.backdrop);
		},
		baseUrl() {
			return BASEURL;
		},
	},
	template: `
	<div class="row">
		<div class="col-12">
			<button class="btn btn-success my-3 btn-block" @click="newBackdrop">
				<i class="fas fa-plus float-left" style="line-height: inherit" ></i> New Backdrop
			</button>
			<modal
				ref="modalComponent"
				v-if="modalComponent"
				:modal-info="{id: 'modal-backdrops', title: 'Backdrop'}"
				@modalClosed="closeModal"
			>
				<component :is="modalComponent" @saved="insertNewBackdrop" :division-id="divisionId"></component>
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
						<div v-if="backdrop.backdrop.image_location">
							<img :src="baseUrl() + backdrop.backdrop.image_location" :alt="backdrop.backdrop.name + '-image'" class="img-thumbnail"/>
						</div>
						<div v-else class=""><i class="far fa-images"></i></div>
					</div>
					<div class="col-7 my-auto font-weight-bold">
						#{ backdrop.backdrop.name }
					</div>
					<div class="col-3 text-right">
						<div class="btn-group btn-group-sm">
							<button class="btn btn-danger" @click="deleteBackdrop" disabled>
								<i class="fas fa-eraser"></i> <span class="d-none d-md-inline">Delete</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`,
});

/*
/* BACKDROPS IN DIVISION FORM
*/

Vue.component("backdropDivisionForm", {
	props: ["backdrop", "divisionId"],
	delimiters: ["#{", "}"],
	data: () => ({
		backdropModel: {
			backdrop_id: "",
			division_id: "",
		},
		backdrops: [],
		ajax: "new",
		loading: false,
	}),
	created() {
		this.$emit("loading", true);
		loadDataGET("backdrops").then((data) => {
			this.backdrops = data.backdrops;
			this.$emit("loading", false);
		});
		this.backdropModel.division_id = this.divisionId;
	},
	methods: {
		saveBackdrop(e) {
			e.preventDefault();
			this.loading = true;
			loadData("division_backdrop", {
				...this.backdropModel,
				ajax: this.ajax,
			}).then((data) => {
				if (data.save) {
					this.$emit("saved", data);
				} else {
					this.loading = false;
				}
				if (data.error) {
					showError(data.error);
				}
			});
		},
	},
	template: `
	<form @submit="saveBackdrop">
		<div class="row">

			<div class="col-12">
				<dropdown-search
					:items="backdrops"
					:options="{
						label: 'Backdrop',
						id: 'booth_type_id',
						placeholder: 'Backdrop'
					}"
					:disabled="backdrops.length < 1"
					v-model="backdropModel.backdrop_id"
				/>
			</div>
			
			<input type="hidden" v-model="backdropModel.division_id" />
			<div class="col-12">
				<button type="submit" class="btn btn-block btn-success" :disabled="loading">ADD</button>
			</div>
		</div>
	</form>
	`,
});

/***********************
 * PROPS COMPONENTS
 ************************/

/*
/* PROPS LIST
*/

Vue.component("propsList", {
	delimiters: ["#{", "}"],
	data: () => ({
		props: [],
		modalComponent: false,
	}),
	created() {
		this.$emit("loading", true);
		loadDataGET("props").then((data) => {
			this.props = data.props;
			this.$emit("loading", false);
		});
	},
	methods: {
		closeModal() {
			this.modalComponent = false;
		},
		editProp() {
			alert("pending");
		},
		deleteProp() {
			alert("pending");
		},
		newProp() {
			this.modalComponent = "propForm";
		},
		insertNewProp(data) {
			this.$refs.modalComponent.closeModal();
			this.props.push(data.prop);
		},
		baseUrl() {
			return BASEURL;
		},
	},
	template: `
	<div class="row">
		<div class="col-12">
			<button class="btn btn-success my-3 btn-block" @click="newProp">
				<i class="fas fa-plus float-left" style="line-height: inherit" ></i> New Prop
			</button>
			<modal
				ref="modalComponent" 
				v-if="modalComponent"
				:modal-info="{id: 'modal-props', title: 'Prop'}"
				@modalClosed="closeModal"
			>
				<component :is="modalComponent" @saved="insertNewProp"></component>
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
						<div v-if="prop.image_location">
							<img :src="baseUrl() + prop.image_location" :alt="prop.name + '-image'" class="img-thumbnail"/>
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
	`,
});

/*
/* PROPS FORM
*/

Vue.component("propForm", {
	props: ["prop"],
	delimiters: ["#{", "}"],
	data: () => ({
		propModel: {
			name: "",
			description: "",
		},
		ajax: "new",
		loading: false,
	}),
	methods: {
		saveProp(e) {
			e.preventDefault();
			this.loading = true;
			let formData = new FormData();
			formData.set("name", this.propModel.name);
			formData.set("ajax", this.ajax);
			formData.set("image", this.propModel.image, this.propModel.image.name);
			loadDataMultipart("prop", formData).then((data) => {
				if (data.save) {
					this.$emit("saved", data);
				} else {
					this.loading = false;
				}
				if (data.error) {
					showError(data.error);
				}
			});
		},
		selectedFile(file) {
			this.propModel.image = file;
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
				<upload-file @file-change="selectedFile" :options="{id: 'prop_image'}" />
			</div>

			<div class="col-12">
				<button type="submit" class="btn btn-block btn-success" :disabled="loading">SAVE</button>
			</div>
		</div>
	</form>
	`,
});

/*
/* PROPS IN DIVISION
*/

Vue.component("propsDivisionList", {
	props: ["divisionId"],
	delimiters: ["#{", "}"],
	data: () => ({
		props: [],
		modalComponent: false,
	}),
	created() {
		this.$emit("loading", true);
		loadDataGET("division_props", { division_id: this.divisionId }).then(
			(data) => {
				this.props = data.props;
				this.$emit("loading", false);
			}
		);
	},
	methods: {
		closeModal() {
			this.modalComponent = false;
		},
		editProp() {
			alert("pending");
		},
		deleteProp() {
			alert("pending");
		},
		newProp() {
			this.modalComponent = "propDivisionForm";
		},
		insertNewProp(data) {
			this.$refs.modalComponent.closeModal();
			this.props.push(data.prop);
		},
		baseUrl() {
			return BASEURL;
		},
	},
	template: `
	<div class="row">
		<div class="col-12">
			<button class="btn btn-success my-3 btn-block" @click="newProp">
				<i class="fas fa-plus float-left" style="line-height: inherit" ></i> New Prop
			</button>
			<modal
				ref="modalComponent"
				v-if="modalComponent"
				:modal-info="{id: 'modal-props', title: 'Prop'}"
				@modalClosed="closeModal"
			>
				<component :is="modalComponent" @saved="insertNewProp" :division-id="divisionId"></component>
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
						<div v-if="prop.prop.image_location">
							<img :src="baseUrl() + prop.prop.image_location" :alt="prop.prop.name + '-image'" class="img-thumbnail" />
						</div>
						<div v-else class=""><i class="far fa-images"></i></div>
					</div>
					<div class="col-7 my-auto font-weight-bold">
						#{ prop.prop.name }
					</div>
					<div class="col-3 text-right">
						<div class="btn-group btn-group-sm">
							<button class="btn btn-danger" @click="deleteProp" disabled>
								<i class="fas fa-eraser"></i> <span class="d-none d-md-inline">Delete</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	`,
});

/*
/* PROPS IN DIVISION FORM
*/

Vue.component("propDivisionForm", {
	props: ["prop", "divisionId"],
	delimiters: ["#{", "}"],
	data: () => ({
		propModel: {
			prop_id: "",
			division_id: "",
		},
		props: [],
		ajax: "new",
		loading: false,
	}),
	created() {
		this.$emit("loading", true);
		loadDataGET("props").then((data) => {
			this.props = data.props;
			this.$emit("loading", false);
		});
		this.propModel.division_id = this.divisionId;
	},
	methods: {
		saveProp(e) {
			e.preventDefault();
			this.loading = true;
			loadData("division_prop", {
				...this.propModel,
				ajax: this.ajax,
			}).then((data) => {
				if (data.save) {
					this.$emit("saved", data);
				} else {
					this.loading = false;
				}
				if (data.error) {
					showError(data.error);
				}
			});
		},
	},
	template: `
	<form @submit="saveProp">
		<div class="row">

			<div class="col-12">
				<dropdown-search
					:items="props"
					:options="{
						label: 'Prop',
						id: 'booth_type_id',
						placeholder: 'Prop'
					}"
					:disabled="props.length < 1"
					v-model="propModel.prop_id"
				/>
			</div>
			
			<input type="hidden" v-model="propModel.division_id" />
			<div class="col-12">
				<button type="submit" class="btn btn-block btn-success" :disabled="loading">ADD</button>
			</div>
		</div>
	</form>
	`,
});

Vue.component("loader", {
	props: {
		loading: {},
		options: {
			Type: Object,
			default: () => {
				return {};
			}
		}
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
	`
});

Vue.component("tabsNavbar", {
	props: ["active", "options"],
	delimiters: ["#{", "}"],
	data: () => ({}),
	methods: {
		clicked(selectedOption) {
			this.$emit("change-option", selectedOption);
		}
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
	`
});

/***********************
 * EVENT COMPONENTS
 ************************/

/*
/* EVENT FORM
*/

Vue.component("eventForm", {
	props: ["event"],
	delimiters: ["#{", "}"],
	data: () => ({
		eventModel: {
			name: "",
			description: ""
		},
		ajax: "new",
		loading: false
	}),
	methods: {
		saveEvent(e) {
			e.preventDefault();
			this.loading = true;
			loadData("event", {
				...this.eventModel,
				ajax: this.ajax
			}).then(data => {
				if (data.save) {
					this.$emit("saved", data);
				} else {
					this.loading = false;
				}
				if (data.error) {
					showError(data.error);
				}
			});
		}
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
	`
});

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
		}
	},
	methods: {
		editEvent() {
			alert("pending");
		},
		deleteEvent() {
			alert("pending");
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

/*
/* EVENT CARD HOLDER
*/

Vue.component("eventCardHolder", {
	delimiters: ["#{", "}"],
	data: () => ({
		events: [],
		modalComponent: false
	}),
	created() {
		this.$emit("loading", true);
		loadData("events").then(data => {
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
			this.events.push(data.event);
		}
	},
	template: `
	<div class="row">
		<div class="col-12">
			<button class="btn btn-success btn-block" @click="newEvent">New event</button>
		</div>
		<modal
			v-if="modalComponent"
			:modal-info="{id: 'modal-event', title: 'Event'}"
			@modalClosed="closeModal"
		>
			<component :is="modalComponent" @saved="insertNewEvent"></component>
		</modal>
		<div class="col-md-6 col-sm-12 mb-3" v-for="event in events">
			<event-card :event="event">
			</event-card>
		</div>
	</div>
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
	data: () => ({}),
	computed: {
		divisionUrl() {
			return BASEURL + "division/" + this.division.url;
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
	data: () => ({
		divisions: [],
		modalComponent: false
	}),
	computed: {
		divisionUrl() {
			return BASEURL + "division/" + this.division.url;
		}
	},
	created() {
		this.$emit("loading", true);
		loadData("divisions").then(data => {
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
	`
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
			description: ""
		},
		ajax: "new",
		loading: false
	}),
	methods: {
		saveDivision(e) {
			e.preventDefault();
			this.loading = true;
			loadData("division", {
				...this.divisionModel,
				ajax: this.ajax
			}).then(data => {
				if (data.save) {
					this.$emit("saved", data);
				} else {
					this.loading = false;
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
 * PHOTOBOOTH COMPONENTS
 ************************/

/*
/* PHOTOBOOTH TYPES LIST
*/
Vue.component("boothTypesList", {
	delimiters: ["#{", "}"],
	data: () => ({
		boothTypes: [],
		modalComponent: false
	}),
	created() {
		this.$emit("loading", true);
		loadData("booth_types").then(data => {
			this.boothTypes = data.booth_types;
			this.$emit("loading", false);
		});
	},
	methods: {
		closeModal() {
			this.modalComponent = false;
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
	data: () => ({
		boothTypeModel: {
			name: "",
			description: ""
		},
		ajax: "new",
		loading: false
	}),
	methods: {
		saveBoothType(e) {
			e.preventDefault();
			this.loading = true;
			loadData("booth_type", {
				...this.boothTypeModel,
				ajax: this.ajax
			}).then(data => {
				if (data.save) {
					this.$emit("saved", data);
				} else {
					this.loading = false;
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

/*
/* PHOTOBOOTH FORM
*/

Vue.component("photoboothForm", {
	props: ["photobooth", "division_id"],
	delimiters: ["#{", "}"],
	data: () => ({
		photoboothModel: {
			name: "",
			booth_type_id: "",
			division_id: ""
		},
		boothTypes: [],
		ajax: "new",
		loading: false
	}),
	created() {
		this.$emit("loading", true);
		loadData("booth_types").then(data => {
			this.boothTypes = data.booth_types;
			this.$emit("loading", false);
		});
		this.photoboothModel.division_id = this.division_id
	},
	methods: {
		savePhotobooth(e) {
			e.preventDefault();
			this.loading = true;
			loadData("photobooth", {
				...this.photoboothModel,
				ajax: this.ajax
			}).then(data => {
				if (data.save) {
					this.$emit("saved", data);
				} else {
					this.loading = false;
				}
				if (data.error) {
					showError(data.error);
				}
			});
		}
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
	`
});

/*
/* PHOTOBOOTH LIST
*/

Vue.component("dropdownSearch", {
	props: {
		items: {
			type: Array,
			required: true
		},
		options: {
			type: Object,
			default: () => ({})
		},
		disabled: {
			type: Boolean,
			required: false
		}
	},
	delimiters: ["#{", "}"],
	data: () => ({
		id: "",
		value: "",
		selected: false,
		showOptions: false,
		activeItem: 0
	}),
	methods: {
		updateValue() {
			this.value = this.items[this.activeItem].name;
			this.$emit("input", this.items[this.activeItem].id);
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
		}
	},
	watch: {
		items() {
			this.updateValue();
		}
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
						<img :src="item.image" :alt="item.name + "-image""/>
					</span>
					<span v-else class=""><i class="far fa-images"></i></span>
					#{item.name}
				</li>
			</ul>
		</div>
	</div>
	`
});

/*
/* PHOTOBOOTH LIST
*/

Vue.component("photoboothList", {
	props: [""],
	delimiters: ["#{", "}"],
	data: () => ({
		photobooth: [],
		modalComponent: false
	}),
	created() {
		this.$emit("loading", true);
		loadData("photobooth").then(data => {
			this.photobooth = data.photobooth;
			this.$emit("loading", false);
		});
	},
	methods: {
		closeModal() {
			this.modalComponent = false;
		},
		editBoothType() {
			alert("pending");
		},
		deleteBoothType() {
			alert("pending");
		},
		newPhotobooth() {
			this.modalComponent = true;
		},
		insertNewPhotobooth(data) {
			this.photobooth.push(data.photobooth);
		}
	},
	template: `
	<div class="row">
		<div class="col-12">
			<button class="btn btn-success my-3 btn-block" @click="newPhotobooth">
				<i class="fas fa-plus float-left" style="line-height: inherit" ></i> New Photobooth
			</button>
			<modal
				v-if="modalComponent"
				:modal-info="{id: 'modal-photobooth', title: 'Photobooth type'}"
				@modalClosed="closeModal"
			>
				<photobooth-form @saved="insertNewPhotobooth"></photobooth-form>
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
			<div class="py-1 px-2 mb-1" v-for="photobooth in photobooth">
				<div class="row">
					<div class="col-2 my-auto font-weight-bold">
						<div v-if="photobooth.image">
							<img :src="photobooth.image" :alt="photobooth.name + "-image""/>
						</div>
						<div v-else class=""><i class="far fa-images"></i></div>
					</div>
					<div class="col-7 my-auto font-weight-bold">
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
	data: () => ({
		backdrops: [],
		modalComponent: false
	}),
	created() {
		this.$emit("loading", true);
		loadData("backdrops").then(data => {
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
			this.backdrops.push(data.backdrop);
		}
	},
	template: `
	<div class="row">
		<div class="col-12">
			<button class="btn btn-success my-3 btn-block" @click="newBackdrop">
				<i class="fas fa-plus float-left" style="line-height: inherit" ></i> New Backdrop
			</button>
			<modal
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
	data: () => ({
		backdropModel: {
			name: "",
			description: ""
		},
		ajax: "new",
		loading: false
	}),
	methods: {
		saveBackdrop(e) {
			e.preventDefault();
			this.loading = true;
			loadData("backdrop", {
				...this.backdropModel,
				ajax: this.ajax
			}).then(data => {
				if (data.save) {
					this.$emit("saved", data);
				} else {
					this.loading = false;
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
						<span class="input-group-text" id="backdrop_upload">Upload</span>
					</div>
					<div class="custom-file">
						<input type="file" class="custom-file-input" id="backdrop_image" name="image" aria-describedby="backdrop_upload" disabled>
						<label class="custom-file-label" for="backdrop_image">Choose file</label>
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
	data: () => ({
		props: [],
		modalComponent: false
	}),
	created() {
		this.$emit("loading", true);
		loadData("props").then(data => {
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
			this.props.push(data.prop);
		}
	},
	template: `
	<div class="row">
		<div class="col-12">
			<button class="btn btn-success my-3 btn-block" @click="newProp">
				<i class="fas fa-plus float-left" style="line-height: inherit" ></i> New Prop
			</button>
			<modal 
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
	data: () => ({
		propModel: {
			name: "",
			description: ""
		},
		ajax: "new",
		loading: false
	}),
	methods: {
		saveProp(e) {
			e.preventDefault();
			this.loading = true;
			loadData("prop", {
				...this.propModel,
				ajax: this.ajax
			}).then(data => {
				if (data.save) {
					this.$emit("saved", data);
				} else {
					this.loading = false;
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
						<span class="input-group-text" id="prop_upload">Upload</span>
					</div>
					<div class="custom-file">
						<input type="file" class="custom-file-input" id="prop_image" name="image" aria-describedby="prop_upload" disabled>
						<label class="custom-file-label" for="prop_image">Choose file</label>
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
				<div class="modal-body">
					<slot></slot>
				</div>
			</div>
		</div>
	</div>
	`
});

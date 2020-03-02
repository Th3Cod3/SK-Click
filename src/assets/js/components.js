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
			return BASEURL + 'manage/' + this.division.url;
		}
	},
	template: `
		<a class="card bg-secondary text-white" v-bind:href="divisionUrl">
			<div class="card-header font-weight-bold">
				#{ division.name }
			</div>
			<div class="card-body">
				#{ division.description }
			</div>
		</a>
	`
});

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
			return BASEURL + 'event/' + this.event.id;
		}
	},
	// v-bind:href="eventUrl"
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

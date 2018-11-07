fetch('allergies.yml').then(function(resp) {
	resp.text().then(function(data) {
		startApp(jsyaml.safeLoad(data));
	});
});

iconMap = {
	meat: "steak",
	vegetable: "corn",
	grain: "flour",
	dairy: "cheese",
	spice: "saltpepper",
	legume: "nuts",
	fruit: "orange",
	other: "sauce"
};

Vue.component('list-item', {
	props: ['allergy', 'icon'],
	computed: {
		twoLine() {
			return (typeof this.allergy === 'string' || this.allergy instanceof String)
		},
		name() {
			return Object.keys(this.allergy)[0]
		},
		extra() {
			return Object.values(this.allergy)[0]
		},
		img() {
			return this.icon
		}
	},
	template: `
		<li v-if="twoLine" class="mdl-list__item mdl-list__item">
			<span class="mdl-list__item-primary-content">
				<img :src="img" class="mdl-list__item-avatar"/>
				{{allergy}}
			</span>
		</li>
		<li v-else class="mdl-list__item mdl-list__item--two-line">
			<span class="mdl-list__item-primary-content">
				<img :src="img" class="mdl-list__item-avatar"/>
				<span>{{name}}</span>
				<span class="mdl-list__item-sub-title">{{extra}}</span>
			</span>
		</li>
	`
});

Vue.component('card', {
	props: ['category', 'allergies'],
	computed: {
		icon() {
			category = this.category.toLowerCase();
			if (category.charAt(category.length - 1) == 's') {
				category = category.slice(0, category.length - 1);
			}
			return "assets/icons/" + iconMap[category] + ".svg"
		},
		style() {
			return "background-image: url(" + this.icon + ")"
		}
	},
	template: `
		<div class="mdl-card mdl-shadow--2dp card">
			<div class="mdl-card__title mdl-card--expand mdl-card--border card-background" :style="style">
				<h2 class="mdl-card__title-text">{{category}}</h2>
			</div>
			<div class="mdl-card__supporting-text">
				<ul class="mdl-list">
					<list-item v-for="allergy in allergies" v-bind:allergy="allergy" v-bind:icon="icon" />
				</ul>
			</div>
		</div>
	`
});

function startApp(data) {
	const app = new Vue({
		el: "#app",
		data: data,
		template: `
			<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
				<header class="mdl-layout__header">
					<div class="mdl-layout__header-row">
						<span class="mdl-layout-title">{{name}}'s Allergies</span>
						<div class="mdl-layout-spacer"></div>
						<span class="mdl-chip mdl-chip--contact mdl-chip--deletable">
							<i class="mdl-chip__action material-icons">search</i>
							<div class="mdl-chip__text">
								<input class="mdl-textfield__input" type="text" id="search" autocomplete="off">
							</div>
							<a href="#" class="mdl-chip__action"><i class="material-icons">cancel</i></a>
						</span>
					</div>
				</header>
				<main class="mdl-layout__content">
					<div class="cards">
						<card v-for="(allergy, category) in allergies" v-bind:category="category" v-bind:allergies="allergy" />
					</div>
				</main>
				<footer class="mdl-mini-footer">
					<div class="mdl-mini-footer__left-section">
						<div class="mdl-mini-footer__link-list">
							Icons designed by Freepik from Flaticon
						</div>
					</div>
					<div class="mdl-mini-footer__link-list">
						<div class="mdl-mini-footer__link-list">
							Copyright 2018 Cameron Devine
						</div>
					</div>
				</footer>
			</div>
		`
	});
}

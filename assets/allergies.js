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
						<div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable mdl-textfield--floating-label mdl-textfield--align-right">
							<label style="display:none" class="mdl-button mdl-js-button mdl-button--icon" for="fixed-header-drawer-exp">
								<i class="material-icons">search</i>
							</label>
							<div styte="display:none" class="mdl-textfield__expandable-holder">
								<input class="mdl-textfield__input" type="text" name="sample" id="fixed-header-drawer-exp">
							</div>
						</div>
					</div>
				</header>
				<main class="mdl-layout__content">
					<div class="cards" id="cards">
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

cardWidth = 350;

function fit() {
	cards = document.getElementById('cards');
	scrollWidth = cards.scrollWidth / cardWidth;
	clientWidth = cards.clientWidth / cardWidth;
	clientHeight = cards.clientHeight;
	overflowWidth = 2 * (scrollWidth - clientWidth);
	if(overflowWidth > 0) {
		if (overflowWidth > 1) {
			cards.style.height = Math.min(clientHeight * Math.floor(overflowWidth) / Math.floor(clientWidth), 2000) + clientHeight;
		} else {
			cards.style.height = clientHeight + 100;
		}
		setTimeout(fit, 0);
	}
}

function start_fit() {
	cards = document.getElementById('cards');
	if (Math.floor(cards.scrollWidth) <= 2 * cardWidth) {
		cards.style.height = undefined;
	} else {
		cards.style.height = 100;
		setTimeout(fit, 0);
	}
}

window.onload = start_fit;
window.onresize = start_fit;

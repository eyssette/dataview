<script>
	import {
		automaticSearch,
		useAdditionalConditions,
		desactivateRegexDefault,
	} from "./config.js";
	import { onMount } from "svelte";
	export let textToSearch = "";
	export let sumFetchSize;

	let hash;
	let inputValue = "";
	let baseURL;
	let searchParams;
	let automaticSearchParam = automaticSearch;
	let desactivateRegexDefaultParam = desactivateRegexDefault;

	onMount(() => {
		baseURL = window.location.origin + window.location.pathname + window.location.search ;
		hash = window.location.hash;
		if (hash) {
			inputValue = decodeURI(
				hash
					.slice(1)
					.split("&")[0]
					.replace(/\+\+\(\?=.*/, "")
			);
			textToSearch = decodeURI(hash.slice(1));
		}
		searchParams = new URL(document.location).searchParams;
		automaticSearchParam = searchParams.get("as");
		desactivateRegexDefaultParam = searchParams.get("dr");
	});

	$: {
		if (automaticSearchParam == "0") {
			automaticSearchParam = false;
		} else {
			automaticSearchParam = automaticSearch;
		}
		if (sumFetchSize >= 200000) {
			automaticSearchParam = false;
			desactivateRegexDefaultParam = true;
		}
	}

	function searchDatabase() {
		if (automaticSearchParam == true && desactivateRegexDefault == true) {
			if (inputValue.length > 2) {
				setTimeout(() => {
					textToSearch = inputValue;
				}, 300);
			} else {
				textToSearch = "";
			}
		} else {
			textToSearch = inputValue;
		}
	}

	function copyURL() {
		navigator.clipboard.writeText(baseURL + "#" + inputValue);
	}
</script>

<label for="search">Rechercher :</label>
{#if automaticSearchParam == true}
	<input
		type="text"
		id="search"
		name="search"
		bind:value={inputValue}
		on:input={searchDatabase} />
{:else}
	<input
		type="text"
		id="search"
		name="search"
		bind:value={inputValue}
		on:change={searchDatabase} />
{/if}

<div class="search-explanations">
	<em>Astuce 1 : </em>ne mettre que le début d'un terme que l'on recherche pour
	pouvoir trouver tous les mots dérivés (p.ex. : “lib” pour “liberté”,
	“libération”, “libérer”, “libre”). <em>Astuce 2 :</em> utiliser
	“terme1+terme2” pour imposer la présence des deux termes. {#if automaticSearchParam == true && desactivateRegexDefault == false}<em
			>Astuce 3 :</em> on peut utiliser des regex (p.ex. “parler|parole”){/if}
</div>

{#if useAdditionalConditions == false}
	<div class="share-search-URL">
		Copier le lien : <button on:click={copyURL}>🔗</button>
	</div>
{/if}

<style>
	label {
		font-size: 1.1em;
	}

	.share-search-URL {
		float: right;
		font-size: 1em;
		right: 10px;
	}

	.search-explanations {
		max-width: 800px;
		margin: auto;
		padding-top: 1em;
		padding-bottom: 1em;
		text-align: justify;
	}
</style>

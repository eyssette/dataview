<script>
	import { onMount } from "svelte";
	import Papa from "papaparse";
	import Table from "../lib/Table.svelte";
	import Search from "../lib/Search.svelte";
	import { title, dataNoHeader, contentAfterTable } from "../lib/config.js";
	let textToSearch = "";
	let parsedData = [];
	let promises = [];
	let searchParams;
	let getURL = "";
	let dataParsed;
	let src;
	let fetchOK = false;
	let sumFetchSize;
	let delimiterPapaParse = "";
	let delimiterPapaParseParam;
	let baseURL;

	onMount(() => {
		baseURL = window.location.origin + window.location.pathname
		searchParams = new URL(document.location).searchParams;
		getURL = searchParams.get("url");
		delimiterPapaParseParam = searchParams.get("d");
	});

	$: {
		if (getURL != "" && getURL !== null) {
			if (delimiterPapaParseParam !== null) {
				if (delimiterPapaParseParam == "\\t") {
					delimiterPapaParseParam = "\t";
				}
				delimiterPapaParse = delimiterPapaParseParam;
			}
			src = getURL.split("|");
			promises = [];
			for (const url of src) {
				promises.push(fetch(url));
			}
			dataParsed = fetchCsv();
		}
	}

	async function fetchCsv() {
		const responses = await Promise.all(promises);
		fetchOK = responses.every((fetchURL) => fetchURL.ok == true);
		const fetchSizeArray = responses.map((response) =>
			response.headers.get("content-length")
		);
		sumFetchSize = fetchSizeArray.reduce(
			(a, b) => parseInt(a) + parseInt(b),
			0
		);
		const data = await Promise.all(
			responses.map((response) => response.text())
		);
		let headers;
		parsedData = [];
		for (const csvData of data) {
			const parse = Papa.parse(csvData, {
				delimiter: delimiterPapaParse,
				comments: "# ",
			}).data;
			dataNoHeader ? (headers = []) : (headers = parse.shift());
			parsedData = [...parsedData, ...parse];
		}
		parsedData.unshift(headers);
		return parsedData;
	}

	let inputURL;
	let inputDelimiter;
	
	function inputButtonClick() {
		delimiterPapaParseParam = inputDelimiter;
		let gotoURL = baseURL;
		if (inputURL !== "" && inputURL != undefined) {
			gotoURL = gotoURL + "?url=" + inputURL;
		}
		if (delimiterPapaParseParam != "" && delimiterPapaParseParam != undefined) {
			gotoURL = gotoURL + "&d=" + delimiterPapaParseParam;
		}
		/* goto(gotoURL) */
		/* getURL = inputURL; */
		window.location.href = gotoURL;
		/* window.location.href = ""; */
	}
	function titleClick() {
		dataParsed=undefined;
		window.location.href = baseURL;
	}
</script>

<h1>{title} <a href="/" on:click={titleClick}>⌂</a></h1>

{#if getURL == "" || getURL == null}
	<p>
		Pas de données à afficher. Complétez les informations ci-dessous et cliquez
		sur le bouton “Envoyer”
	</p>
	<div id="inputs">
		<p>
			<label for="inputURL">Source de vos données : </label>
			<input type="text" id="inputURL" name="inputURL" bind:value={inputURL} />
		</p>
		<p>
			<label for="inputDelimiter">Délimitation des champs : </label>
			<input
				type="text"
				id="inputDelimiter"
				name="inputDelimiter"
				size="5"
				bind:value={inputDelimiter} />
		</p>
		<button on:click={inputButtonClick}>Envoyer</button>
	</div>
{:else}
	{#await dataParsed}
		<p><span class="loader" /></p>
		<p>Chargement des données. Merci de patienter.</p>
	{:then dataParsed}
		{#if fetchOK == true}
			<div class="search">
				<Search bind:textToSearch bind:sumFetchSize />
			</div>
			<Table {dataParsed} bind:textToSearch bind:sumFetchSize />
			<footer class="contentAfterTable">{@html contentAfterTable}</footer>
		{:else}
			<p>Erreur pendant le chargement des données</p>
		{/if}
	{:catch error}
		<p>Erreur pendant le chargement des données</p>
		<p style="color: red">{error.message}</p>
	{/await}
{/if}

<style>
	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
			"Helvetica Neue", Arial, sans-serif;
		color: #333;
	}

	h1,
	p {
		text-align: center;
		margin-top: 1em;
	}

	.search,
	footer,
	#inputs {
		max-width: 960px;
		margin: auto;
		width: 80%;
		text-align: center;
		font-size: 0.9em;
	}

	footer {
		text-align: justify;
		font-size: 1em;
		margin-bottom: 3em;
		max-width: 800px !important;
	}

	:global(.loader) {
		border: 16px solid #f3f3f3;
		border-top: 16px solid #3498db;
		border-radius: 50%;
		width: 120px;
		height: 120px;
		animation: spin 2s linear infinite;
		display: block;
		text-align: center !important;
		padding: 20px;
		margin: 3em auto;
	}

	a {
		text-decoration: none;
		color:#6a0012;
		font-size:0.7em;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>

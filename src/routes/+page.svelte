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

	onMount(() => {
		//baseURL = window.location.origin + window.location.pathname;
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
</script>

<h1>{title}</h1>

{#if getURL == "" || getURL == null}
	<p>
		Pas d'URL. Pour que Dataview fonctionne, il faut indiquer dans l'URL la
		source de vos données, en ajoutant '?url=VOTRE_URL'.
	</p>
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
	footer {
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

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>

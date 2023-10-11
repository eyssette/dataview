<script>
	import { onMount } from "svelte";
	import Papa from "papaparse";
	import Table from "../lib/Table.svelte";
	import Search from "../lib/Search.svelte";
	import { title, contentAfterTable } from "../lib/config.js";
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
	let checkDataNoHeader = false;
	let inputNewHeader;
	let dataNoHeader;
	let dataNoHeaderParam;
	let newHeader = [];
	let newHeaderParam;
	let sourceFormat = "csv-tsv";

	onMount(() => {
		baseURL = window.location.origin + window.location.pathname;
		searchParams = new URL(document.location).searchParams;
		getURL = searchParams.get("url");
		delimiterPapaParseParam = searchParams.get("d");
		dataNoHeaderParam = searchParams.get("dnh");
		newHeaderParam = searchParams.get("nh");
		if (searchParams.get("md") === "1") {
			sourceFormat = "markdown";
		}
	});

	$: {
		if (getURL != "" && getURL !== null) {
			if (delimiterPapaParseParam !== null) {
				if (delimiterPapaParseParam == "\\t") {
					delimiterPapaParseParam = "\t";
				}
				delimiterPapaParse = delimiterPapaParseParam;
			}
			if (dataNoHeaderParam !== null) {
				if (dataNoHeaderParam == "1") {
					dataNoHeaderParam = true;
				} else {
					dataNoHeaderParam = false;
				}
				dataNoHeader = dataNoHeaderParam;
				if (newHeaderParam !== null) {
					newHeader = newHeaderParam.split("|");
				}
			}
			src = getURL.split("|");
			promises = [];
			for (let url of src) {
				if (url.startsWith("https://codimd.apps.education.fr/") && !url.endsWith("download")) {
					url = url+'/download'
					url = url.replace('//download','/download')
					url = url.replace('?both','')
					url = url.replace('?edit','')
					url = url.replace('?view','')
				}
				promises.push(fetch(url));
			}
			dataParsed = fetchData();
		}
	}

	function markdownToCSV(markdown) {
		const lines = markdown.split("\n");
		const csvRows = [];
		const currentTitles = [];
		const regex = /^(\d+)\.\s/;
		let titles = []
		for (let line of lines) {
			line = line.replace(/^[\s\t]+/, "");
			const match = line.match(/^(#+\s)(.+)/);
			if (match && !line.startsWith("# ")) {
				const title = match[2];
				const level = match[1].length - 3;
				currentTitles[level] = title;
				for (let i = level + 1; i < currentTitles.length; i++) {
					currentTitles.pop();
				}
			} else if (
				line.startsWith("- ") ||
				line.startsWith("* ") ||
				regex.test(line)
			) {
				const data = line.replace("- ", "").replace("* ", "").replace(regex, "");
				const rowData = currentTitles.concat(data);
				csvRows.push(rowData.join("\t"));
			} else if (line.startsWith("Titres :") | line.startsWith("Titles :")) {
				const titlesLine = line.replace("Titres :","").replace("Titles :","");
				titles = titlesLine.split("|")
			}
		}
		return [csvRows.join("\n"),titles];
	}

	async function fetchData() {
		const responses = await Promise.all(promises);
		fetchOK = responses.every((fetchURL) => fetchURL.ok == true);
		const fetchSizeArray = responses.map((response) =>
			response.headers.get("content-length")
		);
		sumFetchSize = fetchSizeArray.reduce(
			(a, b) => parseInt(a) + parseInt(b),
			0
		);
		let data = await Promise.all(
			responses.map((response) => response.text())
		);
		let headers;
		parsedData = [];
		let headersMD = [];
		for (let csvData of data) {
			if (sourceFormat=='markdown') {
				const sourceMarkdown = markdownToCSV(data[0])
				csvData = sourceMarkdown[0];
				if (sourceMarkdown[1].length>0) {
					headersMD = sourceMarkdown[1];
					dataNoHeader = true;
				}
			}
			const parse = Papa.parse(csvData, {
				delimiter: delimiterPapaParse,
				comments: "# ",
				skipEmptyLines: "greedy",
			}).data;
			if (newHeader == '') {newHeader = headersMD}
			dataNoHeader ? (headers = newHeader) : (headers = parse.shift());
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
		if (checkDataNoHeader) {
			gotoURL = gotoURL + "&dnh=1";
		}
		if (sourceFormat == "markdown") {
			gotoURL = gotoURL + "&md=1";
		}
		if (inputNewHeader != "" && inputNewHeader != undefined) {
			gotoURL = gotoURL + "&nh=" + inputNewHeader;
		}
		/* goto(gotoURL) */
		/* getURL = inputURL; */
		window.location.href = gotoURL;
		/* window.location.href = ""; */
	}
	function titleClick() {
		dataParsed = undefined;
		window.location.href = baseURL;
	}
</script>

<h1>{title} <a href="/" on:click={titleClick}>⌂</a></h1>

{#if getURL == "" || getURL == null}
	<p>
		Complétez les informations ci-dessous et cliquez sur le bouton “Envoyer”
	</p>
	<form on:submit|preventDefault={inputButtonClick}>
		<p>
			<label for="inputURL"
				>Sources de vos données <span>(séparez chaque URL avec “|”)</span> :
			</label>
			<input
				type="text"
				id="inputURL"
				name="inputURL"
				size="40"
				bind:value={inputURL} />
		</p>
		<p>
			<label for="csv-tsv">Données en csv ou tsv :</label>
			<input type="radio" id="csv-tsv" name="format" value="csv-tsv" checked bind:group={sourceFormat}>
			<label for="markdown">Données en markdown :</label>
			<input type="radio" id="markdown" name="format" value="markdown" bind:group={sourceFormat}>
		</p>
		{#if sourceFormat=="csv-tsv"}
		<p>
			<label for="inputDelimiter"
				>Délimitation des champs <span>(“\t” pour des tabulations)</span> :
			</label>
			<input
				type="text"
				id="inputDelimiter"
				name="inputDelimiter"
				size="5"
				bind:value={inputDelimiter} />
		</p>
		{/if}
		<p>
			<label for="checkDataNoHeader"
				>Cochez cette case si {#if sourceFormat=="csv-tsv"}la première ligne de vos données ne contient pas{:else}vos données ne contiennent pas{/if} le titre des colonnes</label>
			<input
				type="checkbox"
				id="checkDataNoHeader"
				name="checkDataNoHeader"
				bind:checked={checkDataNoHeader} />
		</p>
		{#if checkDataNoHeader}
			<p>
				<label for="inputNewHeader">Titre des colonnes (à séparer par "|") : </label>
				<input
					type="text"
					id="inputNewHeader"
					name="inputNewHeader"
					bind:value={inputNewHeader} />
			</p>
		{/if}
		<button on:click={inputButtonClick}>Envoyer</button>
	</form>
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
	form {
		max-width: 960px;
		margin: auto;
		width: 80%;
		text-align: center;
		font-size: 0.9em;
	}
	form {
		margin-top: 2em;
		background-color: #f3f3f3;
		max-width: 400px;
		padding: 2em 1em 3em 1em;
		border-radius: 10px;
	}

	form span {
		font-size: 0.8em;
	}

	footer {
		text-align: justify;
		font-size: 1em;
		margin-bottom: 3em;
		max-width: 800px !important;
	}

	input {
		display: inline-block;
		margin-top: 0.5em;
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
		color: #6a0012;
		font-size: 0.7em;
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

import React, { useEffect, useState } from "react";
import { PdfLoader, PdfHighlighter } from "react-pdf-highlighter";
import "./App.css";

const App = () => {
	const [pdfFile, setPdfFile] = useState(null);
	const [highlightPdf, setHighlightPDF] = useState(null);
	const [url, setUrl] = useState(null);
	const [displayPDF, setDisplayPDF] = useState(false);
	const [highlightData, setHighlightData] = useState([]);
	const [loading,setLoading] = useState(false);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file && file.type === "application/pdf") {
			const fileUrl = URL.createObjectURL(file);
			setUrl(fileUrl);
			setPdfFile(file);
			setHighlightPDF(file);
		} else {
			alert("Please select a valid PDF file.");
		}
	};

	

	const handleDragOver = (e) => {
		e.preventDefault();
	};

	const handleDrop = (e) => {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		if (file && file.type === "application/pdf") {
			setPdfFile(file);
		} else {
			alert("Please drop a valid PDF file.");
		}
	};

	const handleProceedClick = () => {
		setDisplayPDF(true);
	};

	const handleHighlightClick = async () => {
		if (!pdfFile && !highlightPdf) {
			alert("Please upload a PDF file first.");
			return;
		}
		setLoading(true);
		const formdata = new FormData();
		formdata.append("pdf_file", pdfFile);
		const response = await fetch(
			"https://26d8-2409-40f0-1d-a7b2-9d81-9c17-c834-cec.ngrok-free.app/api/process_pdf",
			{
				method: "POST",
				body: formdata,
			}
		);
		if(response.ok){
		const data = await response.json();
		setHighlightData(data);
		setLoading(false);
	}
	else{
			setLoading(false);
		}
	};


	const handleHighlightLabelClick = async (label) => {
		if (!pdfFile) {
			alert("Please upload a PDF file first.");
			return;
		}
		setLoading(true);
		const formdata = new FormData();
		formdata.append("label", label);
		formdata.append("hex_color", 'FFFF00');
		console.log(highlightData)
		formdata.append("json_data",JSON.stringify(highlightData)); // u need to have double quotes 
		formdata.append("pdf_file",pdfFile);
		const response = await fetch(
			"https://26d8-2409-40f0-1d-a7b2-9d81-9c17-c834-cec.ngrok-free.app/api/highlight_entities",
			{
				method: "POST",
				body: formdata,
			}
		);

		if(response.ok){
		const data = await response.blob();
			// setHighlightPDF(data)
			const url = URL.createObjectURL(data);
			setUrl(url);
			setLoading(false);
		}
		else{
			setLoading(false);
		}
	};

	if(loading){
		return(
			<center>Loading</center>
		)
	}

	
	
	return (
		<div>
			{!displayPDF ? (
				<>
					<div
						style={{
							border: "2px dashed #aaa",
							padding: "20px",
							width: "80%",
							minHeight: "200px",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							marginBottom: "20px",
						}}
						onDragOver={handleDragOver}
						onDrop={handleDrop}>
						<input
							type="file"
							accept=".pdf"
							onChange={handleFileChange}
							style={{ display: "none" }}
							id="fileInput"
						/>
						<label htmlFor="fileInput" style={{ cursor: "pointer" }}>
							{pdfFile
								? pdfFile.name
								: "Click here to upload a PDF file or drag and drop here."}
						</label>
					</div>
					<button
						onClick={handleProceedClick}
						disabled={!pdfFile}
						style={{ padding: "10px 20px", cursor: "pointer" }}>
						Proceed
					</button>
				</>
			) : (
				<div className="pdf-display">
					<div className="pdf-cont">
						<iframe src={url} title="pdf" width="100%" height="100%"/>
					</div>
					<div className="highlight-cont">
						<button onClick={handleHighlightClick}>Highlight</button>
						
						{highlightData && (
							<div className="highlight-content">
								{highlightData["UNIQUE_LABELS"]?.map((pageData, index) => (
									<div key={index}>
										<li
											key={index}
											onClick={async () => handleHighlightLabelClick(pageData)}>
											{pageData}
										</li>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default App;

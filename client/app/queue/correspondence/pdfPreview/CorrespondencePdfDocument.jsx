import React, { useEffect, useRef } from 'react';
import * as pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { v4 as uuidv4 } from 'uuid';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const CorrespondencePdfDocument = (props) => {
  const {
    scale,
    pdfPageProxies,
  } = props;

  const canvasRefs = useRef([]);

  const generatePdfPages = pdfPageProxies?.map((page, index) => {
    return (
      <CorrespondencePdfPage
        key={uuidv4()}
        index={index}
        canvasRefs={canvasRefs}
        page={page}
        scale={scale}
      />
    );
  });

  return (
    <div className="cf-pdf-preview-scrollview">
      <div className="cf-pdf-preview-grid">
        { generatePdfPages }
      </div>
    </div>
  );
};

const CorrespondencePdfPage = (props) => {
  const { page, scale, canvasRefs, index } = props;

  useEffect(() => {
    const canvas = document.getElementById(`canvas-${index}`);
    const context = canvas.getContext('2d');
    const viewport = page.getViewport({ scale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderOptions = {
      canvasContext: context,
      viewport,
    };

    page.render(renderOptions);

  }, [scale]);

  return (
    <canvas id={`canvas-${index}`} className="canvasWrapper" ref={(ref) => (canvasRefs.current[index] = ref)} />
  );
};

export default CorrespondencePdfDocument;

const CorrespondencePdfPage2 = (props) => {
  const { page, scale, uuid, canvasRefs, index } = props;

  useEffect(() => {
    const canvas = document.getElementById(uuid);
    console.log(canvas)
    const context = canvas.getContext('2d');
    const viewport = page.getViewport({ scale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderOptions = {
      canvasContext: context,
      viewport,
    };

    page.render(renderOptions);

  }, []);

  return (
    <canvas id={uuid} ref={(ref) => (canvasRefs.current[index] = ref)} />
  )

  // console.log(props.pdfPageProxy)
  // const containerRef = useRef(null);

  // const pageClassNames = classNames({
  //   'cf-pdf-pdfjs-container': true,
  //   page: true,
  //   'cf-pdf-placing-comment': props.isPlacingAnnotation
  // });

  // // When you rotate a page 90 or 270 degrees there is a translation at the top equal to the difference
  // // between the current width and current height. We need to undo that translation to get things to align.
  // const translateX = (Math.sin((props.rotation / 180) * Math.PI) * (outerDivHeight - outerDivWidth)) / 2;
  // const divPageStyle = {
  //   marginBottom: `${PAGE_MARGIN * props.scale}px`,
  //   width: `${outerDivWidth}px`,
  //   height: `${outerDivHeight}px`,
  //   verticalAlign: 'top',
  //   display: props.isFileVisible ? '' : 'none'
  // };

  // // Pages that are currently drawing should not be visible since they may be currently rendered
  // // at the wrong scale.
  // const pageContentsVisibleClass = classNames({
  //   'cf-pdf-page-hidden': props.isDrawing
  // });

  // // This div is the one responsible for rotating the page. It is within the outer div which changes
  // // its width and height based on whether this page has been rotated to be in a portrait or landscape view.
  // const innerDivStyle = {
  //   transform: `rotate(${props.rotation}deg) translateX(${translateX}px)`
  // };

  // const getDivDimensions = () => {
  //   const innerDivDimensions = {
  //     innerDivWidth: get(this.props.pageDimensions, ['width'], PDF_PAGE_WIDTH),
  //     innerDivHeight: get(this.props.pageDimensions, ['height'], PDF_PAGE_HEIGHT)
  //   };

  //   // If we have rotated the page, we need to switch the width and height.
  //   if (this.props.rotation === 90 || this.props.rotation === 270) {
  //     return {
  //       outerDivWidth: this.props.scale * innerDivDimensions.innerDivHeight,
  //       outerDivHeight: this.props.scale * innerDivDimensions.innerDivWidth,
  //       ...innerDivDimensions
  //     };
  //   }

  //   return {
  //     outerDivWidth: this.props.scale * innerDivDimensions.innerDivWidth,
  //     outerDivHeight: this.props.scale * innerDivDimensions.innerDivHeight,
  //     ...innerDivDimensions
  //   };
  // };

  // return (
    // <div
    //   id={this.props.isFileVisible ? `pageContainer${pageNumberOfPageIndex(this.props.pageIndex)}` : null}
    //   className={pageClassNames}
    //   style={divPageStyle}
    //   ref={containerRef}
    // >
    //   <div
    //     id={this.props.isFileVisible ? `rotationDiv${pageNumberOfPageIndex(this.props.pageIndex)}` : null}
    //     className={pageContentsVisibleClass}
    //     style={innerDivStyle}
    //   >
    //     <canvas ref={canvasRef} className="canvasWrapper" />
    //   </div>
    // </div>
  // );
};

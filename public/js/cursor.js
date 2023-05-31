const cursor = {
	bigBall: document.querySelector(".cursor__ball--big"),
	glowBall: document.querySelector(".cursor__glow"),
	smallBall: document.querySelector(".cursor__ball--small"),
	svg1: document.querySelector(".cursor_svg1"),
	svgNoise: document.querySelector(".cursor_svgNoise"),
	svgGlow: document.querySelector(".cursor_svg2"),
};
let mouseTimeout;
let isTouch;
let isOnclickable;
const offsetX = 15.5;
const offsetY = 13.5;
function isTouchDevice() {
	return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
function initializeCursor() {
	if (isTouchDevice()) return;
	const clickableElements = document.querySelectorAll(".clickable");
	document.body.style.cursor = "none";
	// document.querySelectorAll("div.cursor__ball").forEach((item) => {
	//     item.style.opacity = 1;
	// });
	document.body.addEventListener("mousemove", moveCursor);
	document.addEventListener("click", clickCursor);
	document.querySelectorAll(".hoverable").forEach(item => {
		item.addEventListener("mouseenter", hoverItem);
		item.addEventListener("mouseleave", leaveItem);
	});
	clickableElements.forEach(item => {
		item.addEventListener("mouseenter", hoverOnClickable);
		item.addEventListener("mouseleave", leaveOnClickable);
	});
	window.addEventListener(
		"scroll",
		event => {
			const cursorRect = cursor.smallBall.getBoundingClientRect();
			const mousePointerPositionX = cursorRect.left + 5;
			const mousePointerPositionY = cursorRect.top + 9;
			mouseSleepTimerReset();
			let hoverOnClickableItem = [];
			clickableElements.forEach(item => {
				const rect = item.getBoundingClientRect();
				const x = mousePointerPositionX - rect.left;
				const y = mousePointerPositionY - rect.top;
				if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
				} else {
					hoverOnClickableItem.push(item);
				}
			});
			if (hoverOnClickableItem[0] == undefined) {
				if (isOnclickable) {
					const e = {
						x: mousePointerPositionX,
						y: mousePointerPositionY,
						pageX: mousePointerPositionX - 5,
						pageY: mousePointerPositionY - 9,
					};
					leaveOnClickable(e, true);
				}
			} else {
				const e = { target: hoverOnClickableItem[0] };
				if (isOnclickable) {
					clickableScrollUpdate(e);
				} else {
					hoverOnClickable(e, true);
				}
			}
		},
		{ passive: false }
	);
}
function clickableScrollUpdate(item) {
	const rect = item.target.querySelector(".focus")?.getBoundingClientRect();
	const x = rect.left - offsetX + 15;
	const y = rect.top - offsetY + 13;
	cursor.bigBall.style.left = `${x}px`;
	cursor.bigBall.style.top = `${y}px`;
	cursor.glowBall.style.left = `${x}px`;
	cursor.glowBall.style.top = `${y}px`;

	cursor.bigBall.querySelectorAll("svg").forEach(item => {
		item.querySelector("rect").style.width = `${rect.width}px`;
		item.querySelector("rect").style.height = `${rect.height}px`;
		item.style.width = `${rect.width}px`;
		item.style.height = `${rect.height}px`;
	});

	cursor.glowBall.querySelectorAll("svg").forEach(item => {
		item.querySelector("rect").style.width = `${rect.width}px`;
		item.querySelector("rect").style.height = `${rect.height}px`;
		item.style.width = `${rect.width}px`;
		item.style.height = `${rect.height}px`;
	});

	// cursor.bigBall.style.width = `${rect.width}px`;
	// cursor.bigBall.style.height = `${rect.height}px`;
	// cursor.glowBall.style.width = `${rect.width}px`;
	// cursor.glowBall.style.height = `${rect.height}px`;
	// } while (
	//     cursor.bigBall.style.top == y &&
	//     cursor.bigBall.style.left == x &&
	//     cursor.bigBall.style.width == rect.width &&
	//     cursor.bigBall.style.height == rect.height &&
	//     cursor.glowBall.style.top == y &&
	//     cursor.glowBall.style.left == x &&
	//     cursor.glowBall.style.width == rect.width &&
	//     cursor.glowBall.style.height == rect.height
	// );
}
function hoverOnClickable(e, isScroll = false) {
	if (!isScroll) {
		isOnclickable = true;
	} else {
		// isOnclickable ? (isOnclickable = false) : (isOnclickable = true);
		// isOnclickable = false;
		setTimeout(() => {
			isOnclickable = true;
		}, 200);
	}
	//sticky big cursor
	// gsap.to(cursor.bigBall, { left: e.x - offsetX, top: e.y - offsetY, duration: 0.2 });
	// cursor.bigBall.style.left = `${e.x}px`;
	// cursor.bigBall.style.top = `${e.y}px`;
	// cursor.glowBall.style.left = `${e.x}px`;
	// cursor.glowBall.style.top = `${e.y}px`;
	console.log("hover");
	let focusElm = e.target.querySelector(".focus");
	var rect = focusElm.getBoundingClientRect();
	const x = rect.left + 15;
	const y = rect.top + 13;
	const duration = 0.2;

	let borderRadius = getComputedStyle(focusElm).borderRadius;
	if (borderRadius == "") {
		borderRadius = "1px";
	}

	gsap.to(cursor.bigBall, {
		left: x - offsetX,
		top: y - offsetY,
		duration: duration,
	});
	gsap.to(".cursor_svg", {
		width: rect.width,
		height: rect.height,
		borderRadius: borderRadius,
		duration: duration,
	});
	gsap.to(".cursor_svg_rect", {
		width: rect.width,
		height: rect.height,
		duration: duration,
	});
	gsap.to(cursor.glowBall, {
		left: x - offsetX,
		top: y - offsetY,
		duration: duration,
	});
}
function leaveOnClickable(e, isScroll = false) {
	if (!isScroll) {
		isOnclickable = false;
	} else {
		isOnclickable = true;
		setTimeout(() => {
			isOnclickable = false;
		}, 200);
	}
	gsap.to(cursor.bigBall, {
		left: e.x - offsetX,
		top: e.y - offsetY,
		duration: 0.1,
	});
	gsap.to(".cursor_svg", {
		width: 30,
		height: 30,
		scale: 1.1,
		borderRadius: "50%",
		duration: 0.2,
	});
	gsap.to(".cursor_svg_rect", { width: 30, height: 30, duration: 0.2 });
	gsap.to(cursor.glowBall, {
		left: e.x - offsetX,
		top: e.y - offsetY,
		duration: 0.1,
	});
}
function moveCursor(event) {
	const { pageX, pageY } = event;
	cursor.smallBall.style.left = `${pageX - 5 - window.scrollX}px`;
	cursor.smallBall.style.top = `${pageY - 7 - window.scrollY}px`;
	gsap.to("div.cursor__ball", { opacity: 1, duration: 2 });
	mouseSleepTimerReset();
	if (isOnclickable) {
		return;
	}
	setTimeout(() => {
		cursor.bigBall.style.left = `${pageX - offsetX - window.scrollX}px`;
		cursor.bigBall.style.top = `${pageY - offsetY - window.scrollY}px`;
		cursor.glowBall.style.left = `${pageX - offsetX - window.scrollX}px`;
		cursor.glowBall.style.top = `${pageY - offsetY - window.scrollY}px`;
	}, 50);
}
function mouseSleepTimerReset() {
	clearTimeout(mouseTimeout);
	mouseTimeout = setTimeout(() => {
		gsap.to("div.cursor__ball", { opacity: 0, duration: 2 });
	}, 3000);
}
function clickCursor() {
	if (isOnclickable) return;
	gsap.to(cursor.svg1, { scale: 0.8, duration: 0.2 });
	gsap.to(cursor.svgGlow, { scale: 0.8, duration: 0.2 });
	setTimeout(() => {
		gsap.to(cursor.svg1, { scale: 1, duration: 0.2, ease: "power2.inOut" });
		gsap.to(cursor.svgGlow, {
			scale: 1,
			duration: 0.2,
			ease: "power2.inOut",
		});
	}, 200);
}
function hoverItem() {
	TweenMax.to(cursor.svg1, 0.3, { scale: 2 });
	TweenMax.to(cursor.svgNoise, 0.3, { scale: 2 });
	TweenMax.to(cursor.svgGlow, 0.3, { scale: 2 });
}
function leaveItem() {
	TweenMax.to(cursor.svg1, 0.3, { scale: 1 });
	TweenMax.to(cursor.svgNoise, 0.3, { scale: 1 });
	TweenMax.to(cursor.svgGlow, 0.3, { scale: 1 });
}
initializeCursor();

import "@babylonjs/loaders";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import "@babylonjs/core/Loading/loadingScreen";
import "@babylonjs/loaders/glTF";
import { events } from "./events";

events.on("onSceneDefinition", ({ engine, scene }) => {
	/**
	 * 約5畳（≒8.2㎡）の部屋に机・椅子・パソコン・扉を配置する基本シーン。
	 * 適宜寸法やマテリアルを入れ替えて使ってください。
	 */

	/* --- 部屋（2.9m × 2.9m × 2.5m）--- */
	const roomSize = 2.9; // 1辺
	const wallT = 0.05;

	// 床
	MeshBuilder.CreateGround(
		"floor",
		{ width: roomSize, height: roomSize },
		scene,
	);

	// 壁
	const wallOpts = { width: roomSize, height: 2.5, depth: wallT };
	const frontWall = MeshBuilder.CreateBox("frontWall", wallOpts, scene);
	frontWall.position.z = -roomSize / 2;

	const backWall = frontWall.clone("backWall");
	backWall.position.z = roomSize / 2;

	const leftWall = MeshBuilder.CreateBox(
		"leftWall",
		{ width: wallT, height: 2.5, depth: roomSize },
		scene,
	);
	leftWall.position.x = -roomSize / 2;

	const rightWall = leftWall.clone("rightWall");
	rightWall.position.x = roomSize / 2;

	// 扉（簡易ボックス）
	const door = MeshBuilder.CreateBox(
		"door",
		{ width: 0.8, height: 2, depth: wallT + 0.01 },
		scene,
	);
	door.position.set(0, 1, -roomSize / 2 + 0.01);
	door.material = null; // マテリアルは後で
	/* --- 机 --- */
	const deskW = 1.4;
	const deskD = 0.7;
	const deskH = 0.75;
	const deskTop = MeshBuilder.CreateBox(
		"deskTop",
		{ width: deskW, depth: deskD, height: 0.05 },
		scene,
	);
	deskTop.position.set(0, deskH, 0);

	const legOpts = { width: 0.05, depth: 0.05, height: deskH };
	const legFL = MeshBuilder.CreateBox("legFL", legOpts, scene);
	legFL.position.set(-deskW / 2 + 0.05, deskH / 2, -deskD / 2 + 0.05);
	const legFR = legFL.clone("legFR");
	legFR.position.x = deskW / 2 - 0.05;
	const legBL = legFL.clone("legBL");
	legBL.position.z = deskD / 2 - 0.05;
	const legBR = legFR.clone("legBR");
	legBR.position.z = deskD / 2 - 0.05;

	/* --- 椅子 --- */
	const seatH = 0.45;
	const seat = MeshBuilder.CreateBox(
		"seat",
		{ width: 0.4, depth: 0.4, height: 0.05 },
		scene,
	);
	seat.position.set(0, seatH, -0.6);

	const backrest = MeshBuilder.CreateBox(
		"backrest",
		{ width: 0.4, depth: 0.05, height: 0.4 },
		scene,
	);
	backrest.position.set(0, seatH + 0.225, -0.775);

	/* --- パソコン（モニタ＋台座） --- */
	const monitor = MeshBuilder.CreateBox(
		"monitor",
		{ width: 0.5, height: 0.3, depth: 0.03 },
		scene,
	);
	monitor.position.set(0, deskH + 0.2, 0);

	const monitorBase = MeshBuilder.CreateCylinder(
		"monitorBase",
		{ diameter: 0.15, height: 0.02 },
		scene,
	);
	monitorBase.position.set(0, deskH + 0.05, 0);
});

const request = require("superagent");
const firebase = require("firebase");

//Windows MAC Address

//firebase config
const config = {
	apiKey: "YOUR_API_KEY",
	authDomain: "YOUR_FIREBASE_URL",
	databaseURL: "https://YOUR_FIREBASE_URL",
	projectId: "YOUR_PROJECT_ID",
	storageBucket: "",
	messagingSenderId: "YOUR_SENDER_ID"
};
firebase.initializeApp(config);

//firebase auth
const email = "YOUR_EMAIL";
const password = "YOUR_PASSWORD";
firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
	// Handle Errors here.
	var errorCode = error.code;
	var errorMessage = error.message;
	if (errorCode === 'auth/wrong-password') {
		alert('Wrong password.');
	} else {
		alert(errorMessage);
	}
	console.log(error);
});

//database更新時
const path = "/googleHome";
const key = "word";
const db = firebase.database();
db.ref(path).on("value", function (changedSnapshot) {
	//値取得
	var value = changedSnapshot.child(key).val();
	if (value) {
		console.log(value);

		let index = 0;
		//助詞を除外
		value = value.replace(/ [のをがは]/g, "");

		console.log(value);
		//コマンド生成
		const command = getJsonData(value.split(" ")[index++], {

			//Windows
			"pc": () => {

				//使用コマンド・関数書き出し
				const sleep = "start C:/Windows/System32/rundll32.exe powrprof.dll,SetSuspendState";
				const shutdown = "shutdown -s -f -t 0";
				const reboot = "shutdown -r -f -t 0";
				const dispoff = "powershell D:/Document/nodejs/desktopPC/dispoff.ps1";
				const dispon = "powershell D:/Document/nodejs/desktopPC/dispon.ps1";
				const lock = "powershell D:/Document/nodejs/desktopPC/lock.ps1";
				//音声によって動作分け
				// 第２階層処理
				const display = () => {
					console.log(index);
					return getJsonData(value.split(" ")[index++], {
						"消し": dispoff,
						"けし": dispoff,
						"落とし": dispoff,
						"おとし": dispoff,
						"付け": dispon,
						"つけ": dispon,
						"default": false
					});
				}
				// 第１階層処理（メイン）
				return getJsonData(value.split(" ")[index++], {
					"スリープ": sleep,
					"スタンバイ": sleep,
					"止め": sleep,
					"とめ": sleep,
					"消し": sleep,
					"けし": sleep,
					"閉じ": sleep,
					"とじ": sleep,
					"落とし": sleep,
					"おとし": sleep,
					"シャットダウン": shutdown,
					"リブート": reboot,
					"再": () => { return getJsonData(value.split(" ")[index++], { "起動": reboot, "default": false }); },
					"モニター": display,
					"画面": display,
					"ディスプレイ": display,
					"ロック": lock,
					"default": false
				});
			},

			//default
			"default": () => false,
		})();

		//コマンド実行
		if (runCommand(command)) {
			//firebase clear
			db.ref(path).set({ [key]: "" });
		}
	}
});

//jsonからvalueに一致する値取得
function getJsonData(value, json) {
	for (let word in json) {
		if (value == word) return json[word];
	}
	return json["default"];
}

function runCommand(command) {
	console.log(command);
	command = command === undefined ? true : command;
	if (command) {
		//typeof
		if (typeof command === "string") {
			console.log("string");
			const exec = require('child_process').exec;
			exec(command);
		} else if (typeof command === "function") {
			console.log("function");
			return runCommand(command());
		}
		console.log("true");
		return true;
	}
	return false;
}
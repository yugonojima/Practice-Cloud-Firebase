import React, { useState, useEffect } from "react";
import * as firebase from "firebase";
import "./App.css";

const firebaseConfig = {
  apiKey: "AIzaSyDJG9pexH1nynm5cUs3cOrfpRSQ8a8zxk0",
  authDomain: "my-firebase-practice-a5d84.firebaseapp.com",
  databaseURL: "https://my-firebase-practice-a5d84.firebaseio.com",
  projectId: "my-firebase-practice-a5d84",
  storageBucket: "my-firebase-practice-a5d84.appspot.com",
  messagingSenderId: "928164968680",
  appId: "1:928164968680:web:8dd25dab37e8ed44da715d",
  measurementId: "G-82Q90Q6JHH",
};

firebase.initializeApp(firebaseConfig);

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    const db = firebase.firestore();
    const unSubscribe = db.collection("users").orderBy('age','desc').onSnapshot((querySnapshot) => {
      const _users = querySnapshot.docs.map((doc) => {
        return {
          userId: doc.id,
          ...doc.data(),
        };
      });
      setUsers(_users);
    });

    return () => {
      unSubscribe();
    };
  },[]);

  const handleClickFetchButton = async () => {
    // document 取得
    const db = firebase.firestore();
    // const doc = await db.collection("users").doc("XbE38b7IdozzL4yIqSz9").get();

    // console.log(doc.data());
    // console.log('oooo')

    // collection 取得
    const snapshot = await db.collection("users").get();
    const _users = [];
    snapshot.forEach((doc) => {
      _users.push({
        userId: doc.id,
        ...doc.data(),
      });

      // console.log(doc.id, "=>", doc.data());
    });

    setUsers(_users);
  };

  const handleClickAddButton = async () => {
    if (!name || !age) {
      alert("name or age が入力されていません。");
      return;
    }

    const parseAge = parseInt(age, 10);

    if (isNaN(parseAge)) {
      alert("ageは数値を入力してください");
      return;
    }

    const db = firebase.firestore();
    await db.collection("users").add({
      name: name,
      age: age,
    });

    setName("");
    setAge("");
  };

  const handleClickUpDateButton = async () => {
    if (!name || !age || !id) {
      alert("name or age or idが入力されていません");
      return;
    }

    const db = firebase.firestore();
    await db.collection("users").doc(id).update({
      name: name,
      age: age,
    });
    setName("");
    setAge("");
    setId("");
  };
  const handleClickDeleteButton = async () => {
    if (!id) {
      alert("idを入力してください");
      return;
    }

    const db = firebase.firestore();
    await db.collection("users").doc(id).delete();
    setName("");
    setAge("");
    setId("");
  };

  const userListItems = users.map((user) => {
    return (
      <li key={user.userId}>
        <ul className="user-list">
          <li>ID:{user.userId}</li>
          <li>Name:{user.name}</li>
          <li>Age:{user.age}</li>
        </ul>
      </li>
    );
  });

  return (
    <div className="App">
      <h1>Hello World</h1>
      <div className="container">
        <div className="input">
          <p>name:</p>
          <input
            type="input"
            onChange={(e) => setName(e.target.value)}
            value={name}
          ></input>
        </div>
        <div className="input">
          <p>age:</p>
          <input
            type="input"
            onChange={(e) => setAge(e.target.value)}
            value={age}
          ></input>
        </div>
        <div className="input">
          <p>id:</p>
          <input
            type="input"
            onChange={(e) => setId(e.target.value)}
            value={id}
          ></input>
        </div>
      </div>

      <button onClick={handleClickFetchButton}>取得</button>
      <button onClick={handleClickAddButton}>追加</button>
      <button onClick={handleClickUpDateButton}>更新</button>
      <button onClick={handleClickDeleteButton}>削除</button>
      <ul className="user-list">{userListItems}</ul>
    </div>
  );
}

export default App;

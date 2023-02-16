
  const firebaseConfig = {
    apiKey: "AIzaSyDf1eM6G5qdRE2Upz6pSQsmr-EYc7I4C5Q",
    authDomain: "commercial-bid-analysis.firebaseapp.com",
    databaseURL: "https://commercial-bid-analysis-default-rtdb.firebaseio.com/",
    projectId: "commercial-bid-analysis",
    storageBucket: "commercial-bid-analysis.appspot.com",
    messagingSenderId: "515397248805",
    appId: "1:515397248805:web:32e596ef12465dc89bdccc"
  };

  firebase.initializeApp(firebaseConfig);
  console.log(firebase);

  // References
  const bidnumber = document.getElementById("bidnumber");
  const subject = document.getElementById("subject");
  const modeoftendering = document.getElementById("modeoftendering");
  const bidduedate = document.getElementById("bidduedate");
  const status = document.getElementById("status");
  const f1 = document.getElementById("f1");
  const f5 = document.getElementById("f5");
  const lbu = document.getElementById("lbu");
  const becfinancial = document.getElementById("becfinancial");
  const banninglist = document.getElementById("banninglist");
  const commercialacceptability = document.getElementById("commercialacceptability");
  const remarks = document.getElementById("remarks");

  // Catch all the files in the html
  const inputFiles = document.querySelectorAll("input[type='file']");

  // Buttons
  const uploadData = document.getElementById("upload");
  const readData = document.getElementById("readData");


  function handleUpload(e) {
    
    e.preventDefault();

    let files = [];
    for(let i=0;i<inputFiles.length;i++){
      files.push(inputFiles[i].files[0]);
    }

    // Catch all the file names using map 
    const names = [...document.querySelectorAll("input[type='file']")].map(input => input.getAttribute("name"));

    // Upload files to firebase storage
    const storageRef = firebase.storage().ref();


    const bidno = bidnumber.value;
    // Store the data in the Firebase Realtime Database
    firebase.database().ref('CMA/'+ bidno).set({
        bidnumber: bidnumber.value,
        subject: subject.value,
        modeoftendering: modeoftendering.value,
        bidduedate: bidduedate.value,
        status: status.value,
        f1: f1.value,
        f5: f5.value,
        lbu: lbu.value,
        becfinancial: becfinancial.value,
        banninglist: banninglist.value,
        commercialacceptability: commercialacceptability.value,
        remarks: remarks.value,
    })
    .catch(error => {
      console.log(error);
      alert("Error saving data!!!");
    })

    // uploading files to firebase
    let urls = {};
    for(let i = 0; i < files.length; i++) {
      const file = files[i];
      const name = files[i].name;
      const fileRef = storageRef.child('CBA/'+ bidnumber.value + '/' + names[i] + '-' + name);
      fileRef.put(file).then(snapshot => {
        console.log('File uploaded to Firebase');
        fileRef.getDownloadURL().then(url => {
          // console.log(url);
          urls[names[i]] = url;
          // Store the URLs in the Firebase Realtime Database
          firebase.database().ref('CMA/'+ bidnumber.value).update({
            [names[i]]: url
          });
        });
      });
    }

 }

  function refreshPage() {
    location.reload();
  }

  function handleRead(e) {

    e.preventDefault();

    firebase.database().ref("CMA/"+ bidnumber.value).once("value", snapshot => {


      if(snapshot.exists()) {

        const data = snapshot.val();
        
        bidnumber.value = data.bidnumber;
        subject.value = data.subject;
        modeoftendering.value = data.modeoftendering;
        bidduedate.value = data.bidduedate;
        // status.value = data.status;
        // f1.value = data.f1;
        // f5.value = data.f5;
        // lbu.value = data.lbu;
        // becfinancial.value = data.becfinancial;
        // banninglist.value = data.banninglist;
        // commercialacceptability.value = data.commercialacceptability;
        remarks.value = data.remarks;

      }
      else {
        alert("Bidnumber does not exist");
      }
    })

  }


  uploadData.addEventListener('click', handleUpload);
  readData.addEventListener('click', handleRead);
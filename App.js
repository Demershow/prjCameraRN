import React, {useState, useEffect, useRef} from 'react';
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';

import {Camera} from 'expo-camera'
import * as Permissions from "expo-permissions"
import * as MediaLibary from "expo-media-library"
import ImagePicker from 'react-native-image-picker';



export default function App() {
  const camRef = useRef(null)
  const [type, setType] = React.useState(Camera.Constants.Type.back)
  const [photo, setPhoto] = useState(null)
  const [hasPermission, setHasPermission] = React.useState(null)
  const [open, setOpen] = React.useState(false)

  React.useEffect(()=> {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted")
    })();
    (async () => {
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      setHasPermission(status === "granted")
    })()
  })

  async function takePicture(){
    if(camRef){
      const data = await camRef.current.takePictureAsync();
      setPhoto(data.uri)
      setOpen(true)
    }
  }

  async function SavePicture() {
    const asset = await MediaLibary.createAssetAsync(photo)
    .then(() => {
      alert('saved')
      setOpen(false)
    }).catch((error) => console.error(error))
  }

  function openAlbum(){
    const options = {
      title: 'Selecione uma foto',
      chooseFromLibraryButtonTitle: 'Buscar foto do album..',
      noData: true,
      mediaType: 'photo'
    };



    ImagePicker.launchImageLibrary(options, (response) => {

      if(response.didCancel){
        console.log('Image Picker cancelado...');
      }else if(response.error){
        console.log('Gerou algum erro: ' + response.error);
      }else{
        setPhoto(response.uri);
        setOpen(true);
      }

    })


  }

  if (hasPermission === null) {
    return <View></View>
  } else if (hasPermission === false) {
    return <Text>acesso negado</Text>
  }

 return (
   <View style={styles.container}>
    <StatusBar hidden={true} />
    <Camera
      ref={camRef}
      style={styles.preview}
      type={type}
      flashMode={Camera.Constants.FlashMode.auto}
     >
          <View
          style={{marginBottom: 35, flexDirection: 'row', alignItems: 'flex-end', justifyContent: "space-between"}}
          >
            <TouchableOpacity onPress={() => takePicture()} style={styles.capture}>
              <Text >
                Tirar foto
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openAlbum()} style={styles.capture}>
              <Text>
                Album
              </Text>
            </TouchableOpacity>
          </View>
     </Camera>
     <Modal animationType='slide' transparent={false} visible={open} >
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20}}>
        <Image style={{width: "100%", height: 450, borderRadius: 20}} source={{uri: photo}} />
        <View style={{margin: 10, flexDirection: "row"}}>
        <TouchableOpacity style={{margin: 10}}
          onPress={() => setOpen(false)}
          >
          <Text>
            Fechar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{margin: 10}}
          onPress={SavePicture}
          >
          <Text>
            Salvar
          </Text>
        </TouchableOpacity>
          </View>
      </View>
     </Modal>
   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  preview:{
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20,
  }
})
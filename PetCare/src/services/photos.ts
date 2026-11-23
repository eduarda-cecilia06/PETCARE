import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type Origem = 'camera' | 'galeria';

async function capturar(origem: Origem, quadrada: boolean): Promise<string | null> {
  const perm = origem === 'camera' ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    Alert.alert('Permissão negada', origem === 'camera' ? 'Precisamos de acesso à câmera para tirar a foto.' : 'Precisamos de acesso à galeria para escolher a foto.');
    return null;
  }

  const opcoes: ImagePicker.ImagePickerOptions = {
    mediaTypes: ['images'],
    allowsEditing: quadrada,
    aspect: quadrada ? [1, 1] : undefined,
    quality: 0.4,
    base64: true,
  };

  const result = origem === 'camera' ? await ImagePicker.launchCameraAsync(opcoes) : await ImagePicker.launchImageLibraryAsync(opcoes);
  if (result.canceled || !result.assets?.length) return null;

  const a = result.assets[0];
  return a.base64 ? `data:image/jpeg;base64,${a.base64}` : a.uri;
}

/* Pergunta se o tutor quer usar a câmera ou a galeria e devolve a imagem (data URI) ou null. */
export function escolherFoto(quadrada = true): Promise<string | null> {
  return new Promise((resolve) => {
    Alert.alert(
      'Foto do pet',
      'Como deseja adicionar a foto?',
      [
        { text: 'Tirar foto', onPress: () => capturar('camera', quadrada).then(resolve, () => resolve(null)) },
        { text: 'Escolher da galeria', onPress: () => capturar('galeria', quadrada).then(resolve, () => resolve(null)) },
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(null) },
      ],
      { cancelable: true, onDismiss: () => resolve(null) }
    );
  });
}

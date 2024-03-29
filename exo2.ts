import {
  composeMozaic,
  getData,
  log,
  searchImages,
  sendToServer,
} from './cbAPI';

// function exo2(description: string) {
//   // à compléter
//   /*
//   1. Membuat sebuah promise bertipe <readonly string[]>
//   */
//   const p = new Promise<readonly string[]>((resolve) => {
//     searchImages(description, (urlList) => {
//       resolve(urlList);
//     });
//   });
//   // akhir dari 1.

//   /*trus didalem then itu kan ada urlList. dia itu di return dari resolve(urlList). Jadi yang ada didalem then adalah nilai yang dikembaliin sama Promise. Meskipun di Promise nya engga secara eksplisit dikembaliin (engga ada baris kode return).
//    */
//   p.then((urlList) => {
//     const imageList: Promise<ImageData>[] = [];
//     for (const url of urlList) {
//       const uneImage = new Promise<ImageData>((resolve) => {
//         getData(url, (image) => {
//           resolve(image);
//         });
//       });
//       imageList.push(uneImage);
//     } // sedangkan kalo didalem then itu, harus secara eksplisit dibilang kalo dia return sesuatu
//     return Promise.all(imageList);
//   })
//   .then((imageDataList) => {

//   })
// }

function exo2(description: string): void {
  new Promise<readonly string[]>((resolve) => {
    searchImages(description, (urlList) => {
      resolve(urlList);
    });
  })
    .then((urlList) => {
      const promises: Promise<ImageData>[] = [];

      for (const ul of urlList) {
        const promise = new Promise<ImageData>((resolve) => {
          getData(ul, (imageData) => {
            resolve(imageData);
          });
        });
        promises.push(promise);
      }
      return Promise.all(promises);
    })
    .then((imageDataList) => {
      return new Promise<ImageData>((resolve) => {
        composeMozaic(imageDataList, (mozaic) => {
          resolve(mozaic);
        });
      });
    })
    .then((mozaic) => {
      return new Promise<string>((resolve, reject) => {
        sendToServer(mozaic, (response) => {
          resolve(response);
        });
      })
        .then((response) => {
          log('Voici la reponse du server', response);
        })
        .catch((error) => {
          log('Erreur', error);
        });
    });
}

const bt2 = document.querySelector('#bt2') as HTMLElement;
bt2.onclick = () => exo2('chats');

import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
@Injectable({
  providedIn: 'root'
})
export class VideoService {

  public accessToken = ''

  constructor() { }

  public downloadPDF(moduleName: any, topicName: any, articleName: string) {

    const fileExtension = articleName.split('.').pop();
    const fileName = articleName.split('.')[0];

    // return new Promise(async (resolve, reject) => {
    //   await this.http.downloadFile(
    //     encodeURI(`https://pfizer.sharepoint.com/sites/ProtectPfizerSite/_api/web/GetFileByServerRelativeUrl('/sites/ProtectPfizerSite/Knowledge%20Documents/Awareness%20Videos/Wombat_%20Episode%201_%20Good%20Jan,%20Bad%20Jan_EnglishUS.mp4')/$value`),
    //     {},
    //     this.requestHeader(),
    //     `${this.file.dataDirectory}pdf/${fileName}.${fileExtension}`
    //   ).then((response: unknown) => {
    //     console.log(`${topicName}/${articleName} PDF Success: `, response);
    //     resolve(response);
    //   }).catch((error: any) => {
    //     console.log(`${topicName}/${articleName} PDF Fail: `, error);
    //     reject(error);
    //   });
    // });
  }

  private requestHeader() {
    return {
      Accept: 'application/json;odata=verbose',
      Authorization: this.accessToken,
      Content_Type: 'application/json'
    };
  }


  public async generateAccessToken(): Promise<string> {
    const auth = {
      siteClientId: 'd1da7fb9-4193-4209-873e-26b5c7c819fa@7a916015-20ae-4ad1-9170-eefd915e9272',
      siteClientSecret: 'kYDf9fsdSXrMQFNJDRfkpsELe6XesfL4sKPSd/ngLkY=',
      appClientId: '93a35fea-306c-4f5a-b379-15f0dbcd9594@7a916015-20ae-4ad1-9170-eefd915e9272',
      appClientSecret: 'LtEXuK1eo2kW6Cx/a7w/vRcXvEOvDxrMSE6ps6m25f0=',
      grantType: 'client_credentials',
      resources: '00000003-0000-0ff1-ce00-000000000000/pfizer.sharepoint.com@7a916015-20ae-4ad1-9170-eefd915e9272',
    };
    const authBaseURL = 'https://accounts.accesscontrol.windows.net/7a916015-20ae-4ad1-9170-eefd915e9272/tokens/OAuth/2';

    return new Promise((resolve, reject) => {
      const headers = {
        'Content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json;odata=verbose',
      };
      const body = {
        grant_type: auth.grantType,
        client_id: auth.siteClientId,
        client_secret: auth.siteClientSecret,
        resource: auth.resources,
      };
      CapacitorHttp.post({
        url: authBaseURL, data: body, headers
      }).then((resp: any) => {
        console.log(resp.data)
        this.accessToken = `${resp.data.token_type} ${resp.data.access_token}`;
        resolve(this.accessToken)
      }).catch(err => {
        reject(err)
        console.log(err)
      });
    });
  }
}

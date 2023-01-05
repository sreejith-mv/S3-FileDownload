import { Injectable } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable({
  providedIn: 'root'
})
export class AWSService {
  private bucket = new S3(
    {
      accessKeyId: 'AKIA4UAFEDOSBHJWHH7D',
      secretAccessKey: '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',
      region: 'ap-south-1'
    }
  );

  constructor() { }

  downloadFile(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.bucket.getObject({
        Bucket: 'protect-pfizer',
        Key: 'Sample/Simulator Screen Shot - iPhone 14 Pro - 2022-11-24 at 21.41.46.png',
      }, function (err: any, data: any) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  uploadFile(file: any) {
    const contentType = file.type;
    const params = {
      Bucket: 'protect-pfizer',
      Key: 'Sample/' + file.name,
      Body: file,
      ACL: 'public-read',
      ContentType: contentType
    };
    this.bucket.upload(params, function (err: any, data: any) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      return true;
    });
    //for upload progress
    /*bucket.upload(params).on('httpUploadProgress', function (evt) {
              console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
          }).send(function (err, data) {
              if (err) {
                  console.log('There was an error uploading your file: ', err);
                  return false;
              }
              console.log('Successfully uploaded file.', data);
              return true;
          });*/
  }
}

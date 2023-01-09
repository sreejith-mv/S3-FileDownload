import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AWSService } from '../aws.service';
import { VideoService } from '../video.service';
import { CapacitorVideoPlayer } from 'capacitor-video-player'
import { CapacitorHttp } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild("videoElement") video!: ElementRef;

  public selectedFiles!: FileList;
  public imageUrl: SafeUrl = "";
  private mp4 = 'https://pfizer.sharepoint.com/sites/ProtectPfizerSite/Knowledge%20Documents/Awareness%20Videos/Wombat_%20Episode%201_%20Good%20Jan,%20Bad%20Jan_EnglishUS.mp4';
  // private mp4 = 'https://brenopolanski.github.io/html5-video-webvtt-example/MIB2.mp4';
  mimeCodec = 'video/mp4';

  constructor(
    private awsService: AWSService,
    private videoSrv: VideoService,
    private domSanitizer: DomSanitizer,
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    // this.loadVideo('');
    this.videoSrv.generateAccessToken().then(async token => {
      // this.loadVideo(token)
      const player = await CapacitorVideoPlayer.initPlayer({
        mode: 'fullscreen',
        url: this.mp4,
        playerId: 'fullscreen',
        componentTag: 'app-fullscreen',
        headers: {
          'authority': 'pfizer.sharepoint.com',
  'accept': '*/*',
  'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
  'cache-control': 'no-cache',
  'cookie': 'MSFPC=GUID=d5561347efe6400fbc4d1034a00584ed&HASH=d556&LV=202212&V=4&LU=1670325810481; AMCV_2FE3252C54CC13CC0A4C98A7%40AdobeOrg=1585540135%7CMCIDTS%7C19338%7CMCMID%7C18708365694618354170033706562006246614%7CMCAAMLH-1671460860%7C11%7CMCAAMB-1671460860%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1670863260s%7CNONE%7CvVersion%7C4.4.0; s_nr=1670856121125-Repeat; SIMI=eyJzdCI6MH0=; WSS_FullScreenMode=false; PowerPointWacDataCenter=PUS7; WacDataCenter=PUS7; rtFa=BNtWTVXc4KKFe9L06AGB1sQ6Us1QOj8Mrs1+GZX8WicmN0E5MTYwMTUtMjBBRS00QUQxLTkxNzAtRUVGRDkxNUU5MjcyIzEzMzE3NzUwOTI4NDIyMzI3MiM2QTk0OEFBMC1BMDM4LTMwMDAtMTkwOC05QUU1MjhENzMxQzYjVkVOVUdWMTElNDBQRklaRVIuQ09NVDGMRjFboaz1hr9ssim1/tL53X7e4pwqI2D5hLa8ntxMZwCuJbqN5IS0VWmi7csZWlgHO8yT4dA59Dc/QANZ8NcSXagrcaVO6+DjLyJjpQ4NO0sb5KrEX2z+yaz5SO1k1lcQw8HX/MiNa3rLjGYsX1fmeIF+RtTNl3kbHFipOWVNooOnBiCqaqhTOVngwVS3LmRNsagSNlPSsXdixbw8pJiNLioiTEI51/RYN8cUDrFSJfnitayeCcfokA6n+slWCUvhxHUVDyS5wo2P6Bc8o9qWVJqIgsopXiz99qtdbFr0soZUX6lvMZRrjE6j7mr0nz6N48OSdAO+f/OKPgGAMpMAAAA=; FedAuth=77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48U1A+VjEzLDBoLmZ8bWVtYmVyc2hpcHwxMDAzMjAwMjBhN2RiODllQGxpdmUuY29tLDAjLmZ8bWVtYmVyc2hpcHx2ZW51Z3YxMUBwZml6ZXIuY29tLDEzMzE3NjY3NjE1MDAwMDAwMCwxMzMwMDkwOTc3NDAwMDAwMDAsMTMzMTc4MzczMjg0MDY3MDAxLDIwNC4xMTQuMTk2LjUsNjYsN2E5MTYwMTUtMjBhZS00YWQxLTkxNzAtZWVmZDkxNWU5MjcyLCxjMDMwNjA2YS1hZGYyLTQ3MDAtYmRmNi02ZjNjNTM5ZmE4N2YsNmE5NDhhYTAtYTAzOC0zMDAwLTE5MDgtOWFlNTI4ZDczMWM2LDZhOTQ4YWEwLWEwMzgtMzAwMC0xOTA4LTlhZTUyOGQ3MzFjNiwsMCwxMzMxNzgzNzMyODI4MTY5OTksMTMzMTgwMTAxMjgyODE2OTk5LCwsZXlKNGJYTmZZMk1pT2lKYlhDSkRVREZjSWwwaUxDSjRiWE5mYzNOdElqb2lNU0lzSW1GamNuTWlPaUpiWENKMWNtNDZkWE5sY2pweVpXZHBjM1JsY25ObFkzVnlhWFI1YVc1bWIxd2lYU0lzSW5CeVpXWmxjbkpsWkY5MWMyVnlibUZ0WlNJNklsWkZUbFZIVmpFeFFIQm1hWHBsY2k1amIyMGlMQ0oxZEdraU9pSmlZVkl3U0ZGZldHb3dkV1pSU25wMVFuZ3haRUZuSW4wPSwxMzMxNzc1NDUyODQwNjcwMDEsMTMzMTc3NTA5MjcwMDAwMDAwLDA2M2MwNmQ1LWRmMWYtNDBlOS05NjJkLTdhY2ZhODExN2RkNywsLCwsLDAsLFVTXzIxN19Db250ZW50LFBPZTlTYkxPRFZIdXdDcW1TbEQvakpMYlM5bkxyL1R2OFdrd0FmNTZXVjRvdzlnRkFTTzIvWVppYzhEclRmRDFMT2RXRXhkbkJsNW93S3ZhZEg0MVdtRnR6T1JHa0tJci9vUjd3NDN2a05KVEhNVUpJWjVuQkZ3VDZTSkpzdWlhc2RUYURXaXRyQjRZSzlxZlBJUGRaaFQ0S0VaU1pGVXFlUjhjMjVteG9WN2Zrd2tUdkh2N2NRYVFFT255RHdvUDNDYkJGcGQ4L0k1UWJGRlF0Z3JEU1Z4Q1pDSTUrQUQ4RUp3VzVYcW1CUWxJM2lmWWh2SWN1NjhvUkhyRjRnOTlKaUpOcFc1clFsUUlyOTNaQ0NFbmp3KzZpQ3Q5OGdKbU5VSzVTQ2lwcHJFWjgvV2h0U0hHalZScEw5Umk1SmM4NFAzd280UmFrbm9sdEk4VDdONEhLdz09PC9TUD4=; SIMI=eyJzdCI6MH0=; rtFa=BNtWTVXc4KKFe9L06AGB1sQ6Us1QOj8Mrs1+GZX8WicmN0E5MTYwMTUtMjBBRS00QUQxLTkxNzAtRUVGRDkxNUU5MjcyIzEzMzE3NzUwOTI4NDIyMzI3MiM2QTk0OEFBMC1BMDM4LTMwMDAtMTkwOC05QUU1MjhENzMxQzYjVkVOVUdWMTElNDBQRklaRVIuQ09NVDGMRjFboaz1hr9ssim1/tL53X7e4pwqI2D5hLa8ntxMZwCuJbqN5IS0VWmi7csZWlgHO8yT4dA59Dc/QANZ8NcSXagrcaVO6+DjLyJjpQ4NO0sb5KrEX2z+yaz5SO1k1lcQw8HX/MiNa3rLjGYsX1fmeIF+RtTNl3kbHFipOWVNooOnBiCqaqhTOVngwVS3LmRNsagSNlPSsXdixbw8pJiNLioiTEI51/RYN8cUDrFSJfnitayeCcfokA6n+slWCUvhxHUVDyS5wo2P6Bc8o9qWVJqIgsopXiz99qtdbFr0soZUX6lvMZRrjE6j7mr0nz6N48OSdAO+f/OKPgGAMpMAAAA=; FedAuth=77u/PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48U1A+VjEzLDBoLmZ8bWVtYmVyc2hpcHwxMDAzMjAwMjBhN2RiODllQGxpdmUuY29tLDAjLmZ8bWVtYmVyc2hpcHx2ZW51Z3YxMUBwZml6ZXIuY29tLDEzMzE3NjY3NjE1MDAwMDAwMCwxMzMwMDkwOTc3NDAwMDAwMDAsMTMzMTc4MzczMjg0MDY3MDAxLDIwNC4xMTQuMTk2LjUsNjYsN2E5MTYwMTUtMjBhZS00YWQxLTkxNzAtZWVmZDkxNWU5MjcyLCxjMDMwNjA2YS1hZGYyLTQ3MDAtYmRmNi02ZjNjNTM5ZmE4N2YsNmE5NDhhYTAtYTAzOC0zMDAwLTE5MDgtOWFlNTI4ZDczMWM2LDZhOTQ4YWEwLWEwMzgtMzAwMC0xOTA4LTlhZTUyOGQ3MzFjNiwsMCwxMzMxNzgzNzMyODI4MTY5OTksMTMzMTgwMTAxMjgyODE2OTk5LCwsZXlKNGJYTmZZMk1pT2lKYlhDSkRVREZjSWwwaUxDSjRiWE5mYzNOdElqb2lNU0lzSW1GamNuTWlPaUpiWENKMWNtNDZkWE5sY2pweVpXZHBjM1JsY25ObFkzVnlhWFI1YVc1bWIxd2lYU0lzSW5CeVpXWmxjbkpsWkY5MWMyVnlibUZ0WlNJNklsWkZUbFZIVmpFeFFIQm1hWHBsY2k1amIyMGlMQ0oxZEdraU9pSmlZVkl3U0ZGZldHb3dkV1pSU25wMVFuZ3haRUZuSW4wPSwxMzMxNzc1NDUyODQwNjcwMDEsMTMzMTc3NTA5MjcwMDAwMDAwLDA2M2MwNmQ1LWRmMWYtNDBlOS05NjJkLTdhY2ZhODExN2RkNywsLCwsLDAsLFVTXzIxN19Db250ZW50LFBPZTlTYkxPRFZIdXdDcW1TbEQvakpMYlM5bkxyL1R2OFdrd0FmNTZXVjRvdzlnRkFTTzIvWVppYzhEclRmRDFMT2RXRXhkbkJsNW93S3ZhZEg0MVdtRnR6T1JHa0tJci9vUjd3NDN2a05KVEhNVUpJWjVuQkZ3VDZTSkpzdWlhc2RUYURXaXRyQjRZSzlxZlBJUGRaaFQ0S0VaU1pGVXFlUjhjMjVteG9WN2Zrd2tUdkh2N2NRYVFFT255RHdvUDNDYkJGcGQ4L0k1UWJGRlF0Z3JEU1Z4Q1pDSTUrQUQ4RUp3VzVYcW1CUWxJM2lmWWh2SWN1NjhvUkhyRjRnOTlKaUpOcFc1clFsUUlyOTNaQ0NFbmp3KzZpQ3Q5OGdKbU5VSzVTQ2lwcHJFWjgvV2h0U0hHalZScEw5Umk1SmM4NFAzd280UmFrbm9sdEk4VDdONEhLdz09PC9TUD4=',
  'pragma': 'no-cache',
  'range': 'bytes=44957696-',
  'referer': 'https://pfizer.sharepoint.com/sites/ProtectPfizerSite/Knowledge%20Documents/Awareness%20Videos/Wombat_%20Episode%201_%20Good%20Jan,%20Bad%20Jan_EnglishUS.mp4',
  'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'video',
  'sec-fetch-mode': 'no-cors',
  'sec-fetch-site': 'same-origin',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        }
      })
      CapacitorVideoPlayer.play({
        playerId: 'fullscreen'
      });
      console.log(player)
    });
  }


  loadVideo(_token: string) {
    if (
      "MediaSource" in window &&
      MediaSource.isTypeSupported(this.mimeCodec)
    ) {
      const mediaSource = new MediaSource();
      (this.video.nativeElement as HTMLVideoElement).src = URL.createObjectURL(mediaSource);
      console.log(this.video.nativeElement.src);
      mediaSource.addEventListener("sourceopen", () =>
        this.sourceOpen(mediaSource, _token)
      );
    } else {
      console.error("Unsupported MIME type or codec: ", this.mimeCodec);
    }
  }

  sourceOpen(mediaSource: MediaSource, _token: string) {
    const sourceBuffer = mediaSource.addSourceBuffer(this.mimeCodec);
    const headers = {
      'Authorization': _token
    }
    // return CapacitorHttp.get({ url: this.mp4, headers: headers, responseType: "blob" })
    //   .then((blob: any) => {
    //     sourceBuffer.addEventListener("updateend", () => {
    //       mediaSource.endOfStream();
    //       this.video.  .play();
    //     });
    //     blob.arrayBuffer().then((x: BufferSource) => sourceBuffer.appendBuffer(x));
    //   });
    console.log(headers)
    this.httpClient.get(this.mp4, { headers, responseType: "blob" })
      .subscribe((blob: { arrayBuffer: () => Promise<any>; }) => {
        sourceBuffer.addEventListener("updateend", () => {
          mediaSource.endOfStream();
          this.video.nativeElement.play();
        });
        blob.arrayBuffer().then(x => sourceBuffer.appendBuffer(x));
      });
  }

  upload() {
    const file = this.selectedFiles.item(0);
    this.awsService.uploadFile(file);
  }

  download() {
    this.awsService.downloadFile().then(data => {
      console.log(data)

      var binary = '';
      for (var i = 0; i < data.ContentLength; i++) {
        binary += String.fromCharCode(data.Body[i]);
      }
      // const STRING_CHAR = String.fromCharCode.apply(null, data.Body as any);
      let base64String = btoa(binary);
      console.log('Successfully downloaded file.', data);;
      this.imageUrl = this.domSanitizer.bypassSecurityTrustUrl("data: image / jpg; base64, " + base64String);
    }).catch(err => {
      console.log('There was an error uploading your file: ', err);
    });;
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }
}

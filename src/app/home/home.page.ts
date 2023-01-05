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
          Authorization: token,
          contentType: 'video/mp4'
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

class CameraRepository {
  private key = 'CAM_PERMISSION';
  public grantCameraPermission() {
    localStorage.setItem(this.key, 'true');
  }

  public isCameraPermissionGranted() {
    return localStorage.getItem(this.key) !== null;
  }
}

export const cameraRepository = new CameraRepository();

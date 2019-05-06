class CameraRepository {
  private key = 'CAM_PERMISSION';
  grantCameraPermission() {
    localStorage.setItem(this.key, 'true');
  }

  isCameraPermissionGranted() {
    return localStorage.getItem(this.key) !== null;
  }
}

export const cameraRepository = new CameraRepository();

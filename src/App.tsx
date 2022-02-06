import './App.scss';
import FileUploaderZone from './FileUploaderZone/FileUploaderZone';

function App() {
  return (
    <div className="App">
      <FileUploaderZone
        className='FileUploaderZone'
        URL="http://localhost:6000/upload"
        method='POST'
        formatAccept='.png,.jpeg,.jpg'
        id="My-FileInput"
        mode='DARK'
        label="Upload"
      />
    </div>
  );
}

export default App;

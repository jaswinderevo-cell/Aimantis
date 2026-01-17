// Loader.tsx 
import './loader.css';
export function Loader() {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="maindiv">
        <div>
          <div className="loadericon">
            <div className="outerCircle"></div>
            <div className="icon">
              <span className="text-white">Aimantis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

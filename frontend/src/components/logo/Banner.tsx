import logo from '../../assets/logo.svg';
import './Banner.css'

export default function Banner() {
  return (
    <div className='flex flex-row fixed top-4'>
      <img className='mr-[5px]' src={logo} alt="electus logo" width="20" />
      <h1 className="title">Electus</h1>
    </div>
  );
}
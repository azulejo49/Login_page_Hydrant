/*************************************
 ***  Made By Yohay Hackam         ***
 ***  mail: Yoman_321@hotmail.com  ***
 ***  054-2616626                  ***
 *************************************/


import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard, faCancel, faCloudUpload } from '@fortawesome/free-solid-svg-icons'
import { uploadImage } from '../../services/firebase'
import { addressToCord, CordToAddress } from '../../services/geoCode';
import MyNotification from '../../services/MyNotification'



function AddCustomer({ HandleAddData }) {

  const navigate = useNavigate(); //redirect on add /cancel

  const [customerName, setCustomerName] = useState("")
  const [customerType, setCustomerType] = useState("")
  const [subDomain, setSubDomain] = useState("")
  const [logoUrl, setLogoUrl] = useState()

  const [city, setCity] = useState("")
  const [street, setStreet] = useState("")
  const [number, setNumber] = useState("")
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [geoAddress, setGeoAddress] = useState("")

  const [contactLandLine, setContactLandLine] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")


  //Callback Func to set GeoCode from Human address 
  function getGeoCord(city, street, number) {
    if (city !== "" && street !== "") {
      addressToCord(city, street, number)
        .then(geo => {
          if (geo?.partAddress) {
            setGeoAddress(`${geo.partAddress.street} ${geo.partAddress.number} ,${geo.partAddress.city}`)
            if (geo.partAddress.city.includes(city) && geo.partAddress.street.includes(street)) {
              setLat(geo.geometry.lat)
              setLng(geo.geometry.lng)
            }
          }
          else
            setGeoAddress("?????????? ???? ??????????")
        })
        .catch(err => { setGeoAddress("?????????? ???? ??????????") })
    }
  }
  //Callback Func to set address from lat&lng cord
  function getAddress(lat, lng) {
    if (lat !== "" && lng !== "") {
      CordToAddress(lat, lng)
        .then(geo => {
          if ('partAddress' in geo) {
            setCity(geo.partAddress.city)
            setStreet(geo.partAddress.street)
            setNumber(geo.partAddress.number)
            setGeoAddress(`${geo.partAddress.street} ${geo.partAddress.number} ,${geo.partAddress.city}`)
          }
          else
            setGeoAddress("???? ?????????? ?????????? ????????????????????")
        })
        .catch(err => { setGeoAddress("???? ?????????? ?????????? ????????????????????") })
    }
  }
  /******************************************
   handle update Input Address fields:
  ******************************************/


  //handle update Input City field:
  const handleChangeCity = (event) => {
    setCity(event.target.value);
    getGeoCord(event.target.value, street, number);
  }
  //handle update Input Street field:
  const handleChangeStreet = (event) => {
    setStreet(event.target.value);
    getGeoCord(city, event.target.value, number);
  }
  //handle update Input Number field:
  const handleChangeNumber = (event) => {
    setNumber(event.target.value);
    getGeoCord(city, street, event.target.value);
  }


  //handle update Input lat field:
  const handleChangeLat = (event) => {
    setLat(event.target.value);
    getAddress(event.target.value, lng);
  }
  //handle update Input lng field:
  const handleChangeLng = (event) => {
    setLng(event.target.value);
    getAddress(lat, event.target.value);
  }

  // Set Cordenat & address by Browser GeoLocation
  const getCurrentLocation = (e) => {
    e.preventDefault()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        getAddress(position.coords.latitude, position.coords.longitude)
      }, (err) => {
        if (err.code === 1)
          MyNotification('darkblue', "?????????? ??????????", `???? ?????????? ???????????? ???????? ????????????`)
        else
          MyNotification('darkblue', "?????????? ??????????", `${err.message}: ${err.code}`)
      });
    }

  }

  const HandleAddCustomerSubmit = (e) => {
    e.preventDefault()
    // Callback function from Customer module to update data on server 
    HandleAddData({
      customer_type: customerType,
      customer_name: customerName,
      sub_domain: subDomain,
      logo_url: logoUrl,

      city: city,
      street: street,
      number: number,
      lat: lat,
      lng: lng,

      contact_landline: contactLandLine,
      contact_phone: contactPhone,
      contact_email: contactEmail,

      username: username,
      password: password,
      first_name: firstName,
      last_name: lastName,


    })
    //after update redirect back to Customers screen
    navigate("/customers")
  }


  return (
    <div className="window" >

      <header>
        <h3 className='title'>?????????? ??????????</h3>
      </header>
      <form className="editForm" onSubmit={e => HandleAddCustomerSubmit(e)} >

        <fieldset>
          <label htmlFor='customerType'>?????? ??????????: </label>
          <select id='customerType' name='customerType'
            style={{justifySelf:"center"}}
            required
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value)} >
            <option value="" disabled>?????? ??????</option>
            <option value={2} >?????????? ??????</option>
            <option value={3} >???????? ????????????</option>
          </select>
        </fieldset>

        <fieldset>
          <label htmlFor='logoUrl'>???????? :</label>
          <label htmlFor='logoUrl' 
          style={{    justifySelf: "center"}}
          title='?????? ???????????? ????????'>
            {(logoUrl) ?
              <img src={logoUrl} className='clientLogo' alt='????????' /> :
              <div className='clientLogoPlaceHolder'>
                <FontAwesomeIcon icon={faCloudUpload} />
              </div>
            }
          </label>
          <input type="file" id='logoUrl' name='logoUrl' accept="image/*"
            onChange={(e) => uploadImage(e.target.files[0], "customers", setLogoUrl)} >
          </input>
        </fieldset>

        <fieldset>
          <label htmlFor='customerName'>???? ????????????:</label>
          <input type="text" id='customerName' name='customerName' required placeholder='???? ??????????'
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)} />
        </fieldset>

        <fieldset>
          <label htmlFor='subDomain'>???????? ?????????? :</label>
          <input dir='ltr' type="text" id='subDomain' name='subDomain'
            required
            value={subDomain}
            onChange={(e) => setSubDomain(e.target.value)} />
          <p style={{ "gridColumn": "-1/1" }}>
            <i>{subDomain && window.location.hostname.replace(window.location.hostname.split(".")[0], subDomain)}</i>
          </p>
        </fieldset>

        <h4>?????????? ??????????</h4>
        <hr />

        <div className='btnContainer'>
          <button
            className='btn'
            onClick={e => getCurrentLocation(e)}
          >????????&nbsp;??????????&nbsp;??????????</button>
        </div>

        <fieldset>
          <label htmlFor='city'>??????:</label>
          <input type="text" id='city' name='city' required placeholder='??????'
            value={city}
            onChange={handleChangeCity} />
        </fieldset>

        <fieldset>
          <label htmlFor='street'>????????:</label>
          <input type="text" id='street' name='street' required placeholder='????????'
            value={street}
            onChange={handleChangeStreet} />
        </fieldset>

        <fieldset>
          <label htmlFor='number'>????????:</label>
          <input type="number" id='number' name='number' required placeholder='????????'
            value={number}
            onChange={handleChangeNumber} />
        </fieldset>

        <fieldset>
          <label htmlFor='lat'>???????????????? ????????:</label>
          <input type="number" id='lat' name='lat' required
            value={lat}
            onChange={handleChangeLat} />
        </fieldset>

        <fieldset>
          <label htmlFor='lng'>???????????????? ????????:</label>
          <input type="number" id='lng' name='customerType' required
            value={lng}
            onChange={handleChangeLng} />
        </fieldset>

        {(geoAddress !== "") && <i>{geoAddress}</i>}

        <h4>???????? ??????????</h4>
        <hr />

        <fieldset>
          <label htmlFor='firstName'>???? ????????:</label>
          <input type="text" id='firstName' name='firstName' required placeholder='???? ????????'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)} />
        </fieldset>

        <fieldset>
          <label htmlFor='lastName'>???? ??????????:</label>
          <input type="text" id='lastName' name='lastName' required placeholder='???? ??????????'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)} />
        </fieldset>

        <fieldset>
          <label htmlFor='phone'>??????????:</label>
          <input type="tel" id='phone' name='phone'
            required
            placeholder='??????????'
            value={contactPhone}
            pattern="^[0-9]*[\-]?[0-9]*$"
            onChange={(e) => setContactPhone(e.target.value)} />
        </fieldset>


        <fieldset>
          <label htmlFor='contactLandLine'>?????????? ????????:</label>
          <input type="text" id='contactLandLine' name='contactLandLine' required placeholder='???????? ?????????? ????????'
            value={contactLandLine}
            pattern="^[0-9]*[\-]?[0-9]*$"
            onChange={(e) => setContactLandLine(e.target.value)} />
        </fieldset>


        <fieldset>
          <label htmlFor='email'>????????:</label>
          <input type="email" id='email' name='email' required placeholder='????????????'
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)} />
        </fieldset>

        <fieldset>
          <label htmlFor='username'>???? ????????????:</label>
          <input type="text" id='username' name='username' required placeholder='???? ??????????'
            value={username}
            onChange={(e) => setUsername(e.target.value)} />
        </fieldset>

        <fieldset>
          <label htmlFor='password'>??????????:</label>
          <input type="password" id='password' name='password' required
            placeholder='??????????'
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </fieldset>
        <fieldset>
          <label htmlFor='confirmPassword'>?????????? ??????????:</label>
          <input type="password" id='confirmPassword' name='confirmPassword' required
            placeholder='???????? ???? ????????????'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} />
        </fieldset>

        <div className='btnContainer'>
          <button className="btn" type="cancel"
            onClick={(e) => { e.preventDefault(); navigate("/Customers") }}>??????&nbsp;
            <FontAwesomeIcon icon={faCancel} />
          </button>
          <button className="btn" type="submit">????????&nbsp;
            <FontAwesomeIcon icon={faAddressCard} />
          </button>
        </div>


      </form>
    </div>
  )
}

export default AddCustomer;
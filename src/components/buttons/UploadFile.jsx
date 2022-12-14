import React from 'react'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FatchDataApi from '../../services/FatchDataApi';
import { MyContext } from '../../services/MyProvider';

export default function UploadFile({target,callback,successCodes}) {
    const [file, setFile] = React.useState()

    const { accessToken ,setIsLoading} = React.useContext(MyContext)

    const HandleCallback = (resposne)=>{
        callback(resposne)
        setIsLoading(false)
    }

    React.useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8')
            reader.onload = () => {
                FatchDataApi(target, 'POST', accessToken, HandleCallback, { payload: reader.result ,successCodes ,errorMsgTitle:"שגיאה ביצירת ברזי כיבוי" ,onReject:()=>{setIsLoading(false)}})
            }

        }
    }, [file])


    return (
        <>
            <label htmlFor='file' >
                <CloudUploadIcon />

            </label>
            <input type="file" id='file' name='file' accept="plain/text,.csv"
                onChange={(e) =>{setIsLoading(true); setFile(e.target.files[0])}}
            >
            </input>
        </>
    )
}

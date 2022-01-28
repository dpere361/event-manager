import React, {useState, useEffect} from 'react';
import styles from './FileDownloader.module.css'
import { FaUser, FaSortUp, FaFileDownload } from 'react-icons/fa';
import { getSessions, getAdvisingTypes, getAdvisingFiles } from '../../../api/api';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const FileDownloader = ({studentName, sessionId, purchaseId}) => {

    const [loading, setLoading] = useState(false);

    const handleDownload = (sessionId, purchasedId) => {
        setLoading(true);
        getAdvisingFiles(sessionId, purchasedId).then(
            res => {
                console.log(res.data);
                let a = document.getElementById('download_link');
                
                let zip = new JSZip();

                res.data.map((data) => {
                    var array = new Uint8Array(data.file.Body.data);
                    zip.file(data.fileName, array)
                })

                zip.generateAsync({type:"blob"})
                .then(function (blob) {                        // 1) generate the zip file
                    saveAs(blob, `${studentName}_files.zip`);  // 2) trigger the download
                })
                .catch(err=>console.log(err))

                setLoading(false);

                //var blob = new Blob([array], {type: res.data[0].file.ContentType});

                // let url = URL.createObjectURL(blob);
                // a.href = url;
                // a.download = res.data[0].fileName;
                // a.click();

                // URL.revokeObjectURL(blob);
            }
        ).catch(err => {
            console.log(err);
            setLoading(false);
            }
        )
    }

    return(
        <>
        <Button onClick={() => handleDownload(sessionId, purchaseId)} className={styles.downloadBtn}>
            {loading 
            ?   
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
            : 
                <FaFileDownload/> 
            }
        </Button>
        <a style={{display: 'none'}} id="download_link" download href=''></a>   
        </>
    )
}

export default FileDownloader;
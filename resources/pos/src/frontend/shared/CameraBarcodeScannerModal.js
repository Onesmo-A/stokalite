import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, Modal, Spinner } from "react-bootstrap-v5";

const CameraBarcodeScannerModal = ({
    show,
    onHide,
    onDetected,
    title = "Scan code",
}) => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const rafRef = useRef(null);

    const [starting, setStarting] = useState(false);
    const [error, setError] = useState("");

    const detector = useMemo(() => {
        if (typeof window === "undefined") return null;
        if (!("BarcodeDetector" in window)) return null;
        try {
            return new window.BarcodeDetector({
                formats: [
                    "qr_code",
                    "ean_13",
                    "ean_8",
                    "code_128",
                    "code_39",
                    "upc_a",
                    "upc_e",
                ],
            });
        } catch (e) {
            try {
                return new window.BarcodeDetector();
            } catch (e2) {
                return null;
            }
        }
    }, []);

    const stop = async () => {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }

        const stream = streamRef.current;
        streamRef.current = null;
        if (stream) {
            stream.getTracks().forEach((t) => t.stop());
        }

        const video = videoRef.current;
        if (video) {
            try {
                video.pause();
            } catch (e) {}
            video.srcObject = null;
        }

        setStarting(false);
    };

    const loopDetect = async () => {
        if (!show) return;
        const video = videoRef.current;
        if (!video || !detector) return;

        try {
            const results = await detector.detect(video);
            if (results && results.length > 0) {
                const value = results[0]?.rawValue || "";
                if (value) {
                    onDetected(value);
                    await stop();
                    return;
                }
            }
        } catch (e) {
            // ignore per-frame detect errors
        }

        rafRef.current = requestAnimationFrame(loopDetect);
    };

    const start = async () => {
        setError("");

        // Camera APIs usually require a secure context (HTTPS) or localhost.
        if (typeof window !== "undefined" && window.isSecureContext === false) {
            setError(
                "Camera scan inahitaji HTTPS (secure context). Tumia `https://stokalite.test` au fungua app kwa `http://localhost/...` kisha jaribu tena."
            );
            return;
        }

        if (!navigator?.mediaDevices?.getUserMedia) {
            setError(
                "Browser yako haina camera access (`getUserMedia`). Tumia Chrome/Edge (simu) na ruhusu permission."
            );
            return;
        }

        if (!detector) {
            setError(
                "Browser yako haija-support BarcodeDetector. Tumia Chrome/Edge ya kisasa (simu), kisha hakikisha unatumia HTTPS/localhost."
            );
            return;
        }

        setStarting(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    facingMode: { ideal: "environment" },
                },
            });
            streamRef.current = stream;

            const video = videoRef.current;
            if (!video) return;

            video.srcObject = stream;
            video.setAttribute("playsinline", "true");
            await video.play();

            rafRef.current = requestAnimationFrame(loopDetect);
        } catch (e) {
            setError(
                "Imeshindikana kufungua camera. Ruhusu camera permission, hakikisha unatumia HTTPS/localhost, kisha jaribu tena."
            );
            await stop();
        } finally {
            setStarting(false);
        }
    };

    useEffect(() => {
        if (show) {
            start();
        } else {
            stop();
        }

        return () => {
            stop();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    return (
        <Modal
            show={show}
            onHide={async () => {
                await stop();
                onHide();
            }}
            centered
            size="lg"
            fullscreen="md-down"
            dialogClassName="pos-camera-dialog"
            contentClassName="pos-camera-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error ? (
                    <Alert variant="danger" className="mb-3">
                        {error}
                    </Alert>
                ) : null}

                <div className="pos-camera-wrap">
                    <video ref={videoRef} className="pos-camera-video" />
                    {starting ? (
                        <div className="pos-camera-loading">
                            <Spinner animation="border" role="status" />
                        </div>
                    ) : null}
                </div>

                <div className="text-muted small mt-2">
                    Elekeza camera kwenye QR/Barcode ya bidhaa.
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={async () => {
                        await stop();
                        onHide();
                    }}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CameraBarcodeScannerModal;

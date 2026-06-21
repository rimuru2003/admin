import { useEffect, useMemo, useState } from "react";
import type { PropertyList } from "../property.types";

type Props = {
    properties: PropertyList[];
};

const TILE_SIZE = 256;
const MIN_ZOOM = 3;
const MAX_ZOOM = 16;

const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

const toWorldPoint = (lat: number, lng: number, zoom: number) => {
    const scale = TILE_SIZE * 2 ** zoom;
    const x = ((lng + 180) / 360) * scale;
    const sinLat = Math.sin((lat * Math.PI) / 180);
    const y =
        (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;

    return { x, y };
};

const hasCoordinates = (property: PropertyList) =>
    typeof property.latitude === "number" &&
    typeof property.longitude === "number" &&
    Number.isFinite(property.latitude) &&
    Number.isFinite(property.longitude);

const PropertyMapView = ({ properties }: Props) => {
    const provider = (import.meta.env.VITE_MAP_PROVIDER ?? "osm").toLowerCase();
    const [zoom, setZoom] = useState(6);
    const [viewportWidth, setViewportWidth] = useState(768);

    useEffect(() => {
        const updateViewportWidth = () => {
            const nextWidth = Math.min(768, window.innerWidth - 48);
            setViewportWidth(nextWidth > 320 ? nextWidth : 320);
        };

        updateViewportWidth();
        window.addEventListener("resize", updateViewportWidth);

        return () => window.removeEventListener("resize", updateViewportWidth);
    }, []);

    const coordinateProperties = useMemo(
        () => properties.filter(hasCoordinates),
        [properties],
    );

    const missingLocationProperties = useMemo(
        () => properties.filter((property) => !hasCoordinates(property)),
        [properties],
    );

    const center = useMemo(() => {
        if (coordinateProperties.length === 0) {
            return { lat: -25.2744, lng: 133.7751 };
        }

        const totals = coordinateProperties.reduce(
            (acc, property) => ({
                lat: acc.lat + (property.latitude ?? 0),
                lng: acc.lng + (property.longitude ?? 0),
            }),
            { lat: 0, lng: 0 },
        );

        return {
            lat: totals.lat / coordinateProperties.length,
            lng: totals.lng / coordinateProperties.length,
        };
    }, [coordinateProperties]);

    const centerPoint = useMemo(
        () => toWorldPoint(center.lat, center.lng, zoom),
        [center, zoom],
    );

    const mapSize = viewportWidth;
    const half = mapSize / 2;
    const centerTileX = Math.floor(centerPoint.x / TILE_SIZE);
    const centerTileY = Math.floor(centerPoint.y / TILE_SIZE);

    const markers = coordinateProperties.map((property) => {
        const point = toWorldPoint(
            property.latitude as number,
            property.longitude as number,
            zoom,
        );

        return {
            id: property.id,
            title: property.title,
            x: point.x - centerPoint.x + half,
            y: point.y - centerPoint.y + half,
        };
    });

    if (provider !== "osm") {
        return (
            <div className="card shadow-sm border-0">
                <div className="card-body">
                    <div className="alert alert-light mb-0">
                        Map provider "{provider}" is configured, but this project
                        currently renders the OpenStreetMap view only. Set
                        <code> VITE_MAP_PROVIDER=osm</code> to enable the built-in
                        tile map.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 pt-6">
                <div className="d-flex flex-column">
                    <h3 className="card-title fw-bold">Property Map</h3>
                    <span className="text-muted fs-7">
                        Properties with coordinates appear as markers. Missing
                        locations stay in the list below.
                    </span>
                </div>
                <div className="card-toolbar">
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-light btn-sm"
                            onClick={() => setZoom((current) => clamp(current - 1, MIN_ZOOM, MAX_ZOOM))}
                        >
                            -
                        </button>
                        <button
                            type="button"
                            className="btn btn-light btn-sm"
                            onClick={() => setZoom((current) => clamp(current + 1, MIN_ZOOM, MAX_ZOOM))}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            <div
                className="position-relative overflow-hidden border-top"
                style={{
                    width: "100%",
                    height: mapSize,
                    background: "#dfefff",
                }}
            >
                {Array.from({ length: 3 }).map((_, row) =>
                    Array.from({ length: 3 }).map((__, col) => {
                        const tileX = centerTileX + col - 1;
                        const tileY = centerTileY + row - 1;
                        const left = tileX * TILE_SIZE - centerPoint.x + half;
                        const top = tileY * TILE_SIZE - centerPoint.y + half;

                        return (
                            <img
                                key={`${tileX}-${tileY}`}
                                src={`https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`}
                                alt=""
                                className="position-absolute"
                                style={{
                                    width: TILE_SIZE,
                                    height: TILE_SIZE,
                                    left,
                                    top,
                                    objectFit: "cover",
                                }}
                            />
                        );
                    }),
                )}

                {markers.map((marker) => (
                    <div
                        key={marker.id}
                        className="position-absolute translate-middle"
                        style={{
                            left: marker.x,
                            top: marker.y,
                            zIndex: 3,
                        }}
                    >
                        <div
                            className="d-flex flex-column align-items-center"
                            style={{ width: 180 }}
                        >
                            <div
                                className="rounded-circle bg-danger shadow"
                                style={{ width: 14, height: 14, border: "2px solid #fff" }}
                            />
                            <div className="badge bg-white text-dark mt-2 text-wrap shadow-sm border">
                                {marker.title}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card-body border-top">
                <div className="row g-4">
                    <div className="col-lg-6">
                        <h4 className="fs-6 fw-bold mb-3">Mapped properties</h4>
                        <div className="d-flex flex-column gap-2">
                            {coordinateProperties.length === 0 ? (
                                <div className="alert alert-light mb-0">No properties have coordinates yet.</div>
                            ) : (
                                coordinateProperties.map((property) => (
                                <div
                                    key={property.id}
                                    className="d-flex justify-content-between align-items-center border rounded px-3 py-2"
                                >
                                    <span className="fw-semibold">{property.title}</span>
                                    <span className="text-muted fs-7">
                                            {typeof property.latitude === "number"
                                                ? property.latitude.toFixed(5)
                                                : "—"}
                                            {" , "}
                                            {typeof property.longitude === "number"
                                                ? property.longitude.toFixed(5)
                                                : "—"}
                                        </span>
                                </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <h4 className="fs-6 fw-bold mb-3">Missing location</h4>
                        <div className="d-flex flex-column gap-2">
                            {missingLocationProperties.length === 0 ? (
                                <div className="alert alert-success mb-0">All listed properties have coordinates.</div>
                            ) : (
                                missingLocationProperties.map((property) => (
                                    <div
                                        key={property.id}
                                        className="d-flex justify-content-between align-items-center border rounded px-3 py-2"
                                    >
                                        <span className="fw-semibold">{property.title}</span>
                                        <span className="badge badge-light-warning">Location missing</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyMapView;

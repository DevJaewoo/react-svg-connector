import React, { useRef } from "react";
import NarrowSConnector from "./NarrowSConnector";
import LineConnector from "./LineConnector";
import SConnector from "./SConnector";

export type ShapeDirection =
  | "r2l"
  | "l2r"
  | "l2l"
  | "r2r"
  | "b2t"
  | "b2b"
  | "t2t"
  | "t2b";

export interface Props extends React.SVGProps<SVGPathElement> {
  el1: HTMLDivElement;
  el2: HTMLDivElement;
  shape: "s" | "line" | "narrow-s";
  direction?: ShapeDirection;
  grids?: number;
  stem?: number;
  roundCorner?: boolean;
  stroke?: string;
  strokeWidth?: number;
  minStep?: number;
  startArrow?: boolean;
  endArrow?: boolean;
  arrowSize?: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface ShapeConnectorProps extends React.SVGProps<SVGPathElement> {
  startPoint: Point;
  endPoint: Point;
  stroke?: string;
  strokeWidth?: number;
  startArrow?: boolean;
  endArrow?: boolean;
  arrowSize?: number;
}

/**
 * Connect elements with svg paths
 * @param el1 first element (HTML or React component)
 * @param el2 second element (HTML or React component)
 * @param shape s | line | narrow-s
 * @param direction (right, left, top, bottom) --> (right, left, top, bottom) if shape is narrow-s
 * @param grid number of columns in X/Y axis from the start point to the end point
 * @param stem min distance from the start point to the first transition
 * @param minStep radius of the transition curve, default is min of (deltaX/grid, deltaY/grid)
 * @param roundCorner true to have a curve transition
 * @param stroke color of the svg path
 * @param strokeWidth width of the svg path
 * @param startArrow true to have an arrow at the start point (not applicable for s shape)
 * @param endArrow true to have an arrow at the end point (not applicable for s shape)
 * @param arrowSize size of arrows
 */

export default function SvgConnector(props: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  function getCoords(el: HTMLElement) {
    const style = window.getComputedStyle(el);
    const matrix = new DOMMatrixReadOnly(style.transform);

    const x = el.offsetLeft + matrix.m41;
    const y = el.offsetTop + matrix.m42;

    return {
      top: y,
      bottom: y + el.offsetHeight,
      left: x,
      right: x + el.offsetWidth,
    };
  }

  function getNewCoordinates() {
    const el1Coords = getCoords(props.el1);
    const el2Coords = getCoords(props.el2);

    const el1Dimesion = {
      width: el1Coords.right - el1Coords.left,
      height: el1Coords.bottom - el1Coords.top,
    };

    const el2Dimesion = {
      width: el2Coords.right - el2Coords.left,
      height: el2Coords.bottom - el2Coords.top,
    };

    let start = {
      x: el1Coords.right,
      y: el1Coords.top + el1Dimesion.height / 2,
    };

    let end = {
      x: el2Coords.left,
      y: el2Coords.top + el2Dimesion.height / 2,
    };

    switch (props.direction) {
      case "l2l":
        start.x = el1Coords.left;
        break;
      case "l2r":
        start.x = el1Coords.left;
        end.x = el2Coords.right;
        break;
      case "r2r":
        start.x = el1Coords.right;
        end.x = el2Coords.right;
        break;
      case "b2t":
        start = {
          x: el1Coords.left + el1Dimesion.width / 2,

          y: el1Coords.bottom,
        };
        end = {
          x: el2Coords.left + el2Dimesion.width / 2,
          y: el2Coords.top,
        };
        break;
      case "b2b":
        start = {
          x: el1Coords.left + el1Dimesion.width / 2,
          y: el1Coords.bottom,
        };
        end = {
          x: el2Coords.left + el2Dimesion.width / 2,
          y: el2Coords.bottom,
        };
        break;
      case "t2t":
        start = {
          x: el1Coords.left + el1Dimesion.width / 2,
          y: el1Coords.top,
        };
        end = {
          x: el2Coords.left + el2Dimesion.width / 2,
          y: el2Coords.top,
        };
        break;
      case "t2b":
        start = {
          x: el1Coords.left + el1Dimesion.width / 2,
          y: el1Coords.top,
        };
        end = {
          x: el2Coords.left + el2Dimesion.width / 2,
          y: el2Coords.bottom,
        };
        break;
      default:
        break;
    }

    return { start, end };
  }

  if (!props.el1 || !props.el2) return null;

  const coordinates = getNewCoordinates();

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "absolute",
        top: 0,
        width: wrapperRef.current?.offsetParent?.scrollWidth || "100%",
        height: wrapperRef.current?.offsetParent?.scrollHeight || "100%",
        zIndex: 0,
      }}
    >
      {props.shape === "line" && (
        <LineConnector
          {...props}
          startPoint={coordinates.start}
          endPoint={coordinates.end}
          startArrow={props.startArrow}
          endArrow={props.endArrow}
          arrowSize={props.arrowSize}
        />
      )}
      {props.shape === "s" && (
        <SConnector
          {...props}
          startPoint={coordinates.start}
          endPoint={coordinates.end}
          startArrow={props.startArrow}
          endArrow={props.endArrow}
          arrowSize={props.arrowSize}
        />
      )}
      {props.shape === "narrow-s" && (
        <NarrowSConnector
          {...props}
          startPoint={coordinates.start}
          endPoint={coordinates.end}
          stem={props.stem}
          grids={props.grids}
          roundCorner={props.roundCorner}
          direction={props.direction}
          minStep={props.minStep}
          startArrow={props.startArrow}
          endArrow={props.endArrow}
          arrowSize={props.arrowSize}
        />
      )}
    </div>
  );
}

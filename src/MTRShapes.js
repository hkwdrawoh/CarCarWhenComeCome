import React, {Fragment} from 'react';

function StationCircle (props)  {

    let svgToRender;

    switch (props.lines) {
        case 0:
            svgToRender = <circle cx="50%" cy="25%" className="station_icon" />;
            break;
        case 1:
            svgToRender = <circle cx="50%" cy="75%" className="station_icon" />;
            break;
        case 2:
            svgToRender = <>
                <rect x="50%" y="75%" rx="0.4em" className={`interchange_vertical color_${props.names[0]}`} />
                <circle cx="50%" cy="75%" className="station_icon" />
            </>;
            break;
        case 4:
            svgToRender = <>
                <rect x="50%" y="35%" rx="0.4em" className={`interchange_horizontalR color_${props.names[2]}`} />
                <rect x="50%" y="55%" rx="0.4em" className={`interchange_horizontalR color_${props.names[1]}`} />
                <rect x="50%" y="45%" rx="0.4em" className={`interchange_horizontalL color_${props.names[0]}`} />
                <rect x="50%" y="75%" rx="0.9em" className="station_icon3" />
            </>;
            break;
        case 5:
            svgToRender = <>
                <svg viewBox="0 0 63 45" preserveAspectRatio="none">
                    <path
                        d="M31.5 34.5 L31.5 14"
                        stroke="black"
                        strokeWidth="0.2em"
                        strokeDasharray="2 2"
                        fill="none"
                    />
                </svg>
                <rect x="50%" y="20%" rx="0.4em" className={`interchange_horizontalR color_${props.names[0]}`} />
                <circle cx="50%" cy="20%" className="station_icon" />
                <circle cx="50%" cy="75%" className="station_icon" />
            </>;
            break;
        case 6:
            svgToRender = <>
                <svg viewBox="0 0 63 45" preserveAspectRatio="none">
                    <path
                        // d="M30 25 L50 25 L50 10"
                        d="M30 20 L50 20 "
                        stroke="black"
                        strokeWidth="0.2em"
                        strokeDasharray="2 2"
                        fill="none"
                    />
                </svg>
                <rect x="83%" y="45%" rx="0.4em" className={`interchange_vertical color_${props.names[1]}`} />
                <circle cx="83%" cy="45%" className="station_icon" />
                <rect x="50%" y="55%" rx="0.4em" className={`interchange_horizontalL color_${props.names[0]}`} />
                <rect x="50%" y="75%" rx="0.9em" className="station_icon2" />
            </>;
            break;
        case 7:
            svgToRender = <>
                <svg viewBox="0 0 93 45" preserveAspectRatio="none">
                    <path
                        d="M45 20 L70 20"
                        stroke="black"
                        strokeWidth="0.2em"
                        fill="none"
                    />
                </svg>
                <rect x="75%" y="43%" rx="0.4em" className={`interchange_horizontalR color_${props.names[2]}`} />
                <rect x="75%" y="23%" rx="0.4em" className={`interchange_horizontalR color_${props.names[1]}`} />
                <rect x="75%" y="45%" rx="0.9em" className="station_icon2" />
                <rect x="50%" y="55%" rx="0.4em" className={`interchange_horizontalL color_${props.names[0]}`} />
                <rect x="50%" y="75%" rx="0.9em" className="station_icon2" />
            </>;
            break;
        default:
            svgToRender = <circle cx="50%" cy="75%" className="station_icon" />;
            break;
    }

    return (svgToRender)
}

function RouteLine (props) {

    let componentToRender;

    switch (props.state) {
        case "start":
            componentToRender = <rect y="75%" className={`line_start color_${props.name}`} />;
            break;
        case "end":
            componentToRender = <rect y="75%" className={`line_end color_${props.name}`} />;
            break;
        case "split_start":
            componentToRender = <rect y="25%" className={`line_start color_${props.name}`} />;
            break;
        case "split_mid":
            componentToRender = <>
                componentToRender = <rect y="25%" className={`line_start color_${props.name}`} />;
                componentToRender = <rect y="25%" className={`line_end color_${props.name}`} />;
            </>;
            break;
        case "split_end":
            componentToRender = <rect y="25%" className={`line_start color_${props.name}`} />;
            break;
        case "split":
            componentToRender = <>
                <svg viewBox="0 0 63 45" preserveAspectRatio="none">
                    <path
                        d="M31.5 30 Q31.5 11.3 51.3 11.3 L63 11.3"
                        strokeWidth="0.53em"
                        fill="none"
                        className={`stroke_${props.name}`}
                    />
                </svg>
            </>;
            break;
        case "merge":
            componentToRender = <>
                <svg viewBox="0 0 63 45" preserveAspectRatio="none">
                    <path
                        d="M0 11.3 L11.5 11.3 Q31.5 11.3 31.5 30"
                        strokeWidth="0.5em"
                        fill="none"
                        className={`stroke_${props.name}`}
                    />
                </svg>
            </>;
            break;
        case "split_dash":
            componentToRender = <>
                <svg viewBox="0 0 63 45" preserveAspectRatio="none">
                    <path
                        d="M8 30 Q8 11.3 28 11.3 L63 11.3"
                        strokeWidth="0.53em"
                        strokeDasharray="8 5"
                        strokeDashoffset="2"
                        fill="none"
                        className={`stroke_${props.name}`}
                    />
                </svg>
            </>;
            break;
        case "merge_dash":
            componentToRender = <>
                <svg viewBox="0 0 63 45" preserveAspectRatio="none">
                    <path
                        d="M0 11.3 L35 11.3 Q55 11.3 55 30"
                        strokeWidth="0.53em"
                        strokeDasharray="8 5"
                        strokeDashoffset="2"
                        fill="none"
                        className={`stroke_${props.name}`}
                    />
                </svg>
            </>;
            break;
        default:
            componentToRender = <>
                componentToRender = <rect y="75%" className={`line_start color_${props.name}`} />;
                componentToRender = <rect y="75%" className={`line_end color_${props.name}`} />;
            </>;
            break;
    }

    return (componentToRender)
}

export const MTRLines = (props) => {
    return (
        <div className="grid-5-fixed">
            <h3 className="text_right">{props.from.split('\n').map((text, i) => (<Fragment key={i}>{text}<br /></Fragment>))}</h3>
            <svg className="svg_narrow grid-span2">
                <rect className={`line_complete color_${props.lineColor}`} />
                svgToRender = <circle className="station_icon line-start" />;
                svgToRender = <circle className="station_icon line-end" />;
            </svg>
            <h3 className="text_left">{props.to.split('\n').map((text, i) => (<Fragment key={i}>{text}<br /></Fragment>))}</h3>
            <h2 className={`button_base color_${props.lineColor}`}>{props.lineName}</h2>
        </div>
    )
}

export const MTRStations = (props) => {
    return (
        <div className={`${props.selected ? '' : 'list_button'} ${(props.lines >= 7) ? 'station_wide' : 'station'}`}>
            <svg className='svg_station'>
                {(props.lineStyle[0] !== null) ? <RouteLine state={props.lineStyle[0]} name={props.lineColor} /> : null}
                {(props.lineStyle[1] !== '') ? <RouteLine state={props.lineStyle[1]} name={props.lineColor} /> : null}
                <StationCircle lines={props.lines} names={props.lineName}/>
            </svg>
            <h2 style={{"margin": "-0.4rem 0 -0.2rem 0"}}>{props.name}</h2>
        </div>
    )
}


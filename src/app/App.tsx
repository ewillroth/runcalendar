import { hot } from 'react-hot-loader/root';
import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import {
	Grid,
	Button,
	AppBar,
	Hidden,
	Menu,
	IconButton,
} from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeStyles } from '@material-ui/styles';
import Calendar from './Calendar';
import Options, { IOptions } from './Options';
import { DATE_FORMAT_EVENT } from '../utils/utils';

const useStyles = makeStyles({
	cancelIcon: {
		position: 'fixed',
		top: 0,
		left: 0,
	},
});

const App = () => {
	const [options, setOptions] = useState<IOptions>({
		calendarName: 'New Calendar',
		startDate: moment().format(),
		endDate: moment().format(),
		length: 0,
		plan: 'Custom',
	});
	const [workouts, setWorkouts] = useState<string[]>([]);

	const classes = useStyles();

	const handleClick = () => {
		const events = [];
		for (let i = 0; i < workouts.length - 1; i++) {
			const date = moment(options.startDate)
				.add(i, 'd')
				.format(DATE_FORMAT_EVENT);
			const begin = `BEGIN:VEVENT\n`;
			const summary = `SUMMARY:${workouts[i]}\n`;
			const dtStart = `DTSTART:${date}\n`;
			const dtEnd = `DTEND:${date}\n`;
			const end = `END:VEVENT\n`;
			events.push(begin + summary + dtStart + dtEnd + end);
		}
		const start = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:+//runcalendar.app//runcalendar 2.0\nNAME:${options.calendarName}\nX-WR-CALNAME:${options.calendarName}\n`;
		const end = `END:VCALENDAR`;

		var blob = new Blob([start, events.join(''), end], {
			type: 'text/calendar;charset=utf-8;',
		});
		saveAs(blob, `${options.calendarName}.ics`);
	};

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const toggleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<MuiPickersUtilsProvider utils={MomentUtils}>
			<Grid
				container
				direction="column"
				justify="center"
				alignItems="center"
			>
				<Hidden smDown>
					<AppBar color="default">
						<Grid
							className="desktopNav"
							container
							spacing={10}
							direction="row"
							justify="center"
							alignItems="center"
						>
							<Grid item>
								<Options
									direction="row"
									options={options}
									setOptions={setOptions}
									setWorkouts={setWorkouts}
									workouts={workouts}
								/>
							</Grid>
							<Grid item>
								<Button
									onClick={handleClick}
									size="small"
									color="primary"
									variant="contained"
									disableElevation
								>
									Download
								</Button>
							</Grid>
						</Grid>
					</AppBar>
				</Hidden>
				<Hidden mdUp>
					<AppBar color="default">
						<Grid
							container
							justify="space-between"
							alignItems="center"
						>
							<IconButton
								aria-label="more"
								aria-controls="long-menu"
								aria-haspopup="true"
								onClick={toggleMenu}
							>
								<MoreVertIcon />
							</IconButton>

							<Menu
								open={Boolean(anchorEl)}
								anchorEl={anchorEl}
								onClose={handleClose}
							>
								{anchorEl && (
									<IconButton className={classes.cancelIcon}>
										<CancelIcon onClick={handleClose} />
									</IconButton>
								)}
								<Options
									direction="column"
									options={options}
									setOptions={setOptions}
									setWorkouts={setWorkouts}
									workouts={workouts}
								/>
							</Menu>
							<Button
								onClick={handleClick}
								size="small"
								color="primary"
								variant="contained"
								disableElevation
							>
								Download
							</Button>
						</Grid>
					</AppBar>
				</Hidden>
				<Calendar
					setOptions={setOptions}
					options={options}
					setWorkouts={setWorkouts}
					workouts={workouts}
					startDate={options.startDate}
				/>
			</Grid>
		</MuiPickersUtilsProvider>
	);
};

export default hot(App);

import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import TokenService from '../Services/token-service';
import config from '../config';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Title from './Dashboard/Title';
import {useContext} from './Context';
import SpellsApiService from '../Services/spells-api-service';
import EditIcon from '@material-ui/icons/Edit';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import CodeIcon from '@material-ui/icons/Code';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import {textTrim} from './Dashboard/SpellChart.js'

const Spellcard = (props) => {
  const classes = useStyles();
  let history = useHistory();

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };


  const clickForkIcon = (id) => {
    SpellsApiService.forkSpellById(id)
    .then((spell) => {
      history.push(`/spells/${spell.id}`)
    })
  }

  function textTrim(text, length){
    if (!text) return '';

    if(text.length > length){
      return text.slice(0, length) + '...';
    } else {
      return text;
    }
  }

  return (
    <Grid item key={props.spell.id} xs={12} sm={6} md={4}>
      <Card className={classes.card}>
      <CardHeader
        // avatar={
        //   <Avatar aria-label="recipe" className={classes.avatar}>
        //     R
        //   </Avatar>
        // }
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title={textTrim(props.spell.name, 19)}
        subheader={new Date(Date.parse(props.spell.date_created)).toLocaleDateString()}
      />



        <CardMedia
          className={classes.cardMedia}
          image="https://source.unsplash.com/random"
          title="Image title"
        />

        <CardContent className={classes.cardContent}>
          <Typography>
            {textTrim(props.spell.description, 30)}
          </Typography>
        </CardContent>

        <div className={classes.chip}>
        {props.spell.tags.map(t => (
          <Chip
          key={t.id}
          variant="outlined"
          size="small"
          label={t.name}
          // onClick={}
          />
        ))}
        </div>

        <CardActions disableSpacing>
          {/* <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton> */}
          <IconButton onClick={() => clickForkIcon(props.spell.id)}>
              <Tooltip title="Fork Spell" placement="top">
                <IconButton aria-label="Fork Spell">
                  <CallSplitIcon />
                </IconButton>
              </Tooltip>
            {/* <svg class="octicon octicon-repo-forked" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg> */}
          </IconButton>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
          <Tooltip title="View Code" placement="top">
            <IconButton aria-label="View Code">
              <CodeIcon />
            </IconButton>
          </Tooltip>
          </IconButton>
        </CardActions>

        <Dialog
          // open={open}
          open={expanded}
          onClose={handleExpandClick}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{`${props.spell.name}`}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <CodeMirror
                value={props.spell.text}
                // value={'Bogus stuff'}
                options={{
                  mode: 'scheme',
                  theme: 'material',
                  lineNumbers: true,
                  readOnly: "nocursor"
                }}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
          </DialogActions>
        </Dialog>


      </Card>
    </Grid>
  )
};

const useStyles = makeStyles((theme) => ({
  album: {
  },
  // card: {
  //   maxWidth: 345,
  //   margin: '1%',
  // },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  chip: {
    flexDirection:'row',
    display: 'flex',
    flexWrap: 'wrap',
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    // flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

export default Spellcard;

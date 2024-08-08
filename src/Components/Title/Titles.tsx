import React, { useState } from 'react';
import CustomBox, { OverviewBoxComponent, ProjectScopeBoxComponent, CategoriesBoxComponent } from '../Box/Box';
import OverviewGrid from '../OverviewGrid/OverviewGrid';
import { ProjectName, Code, OverviewTitle, ProjectScopeTitle, Separator, StyledProjectDiv, StyledTitleIconDiv, StyledUl } from './TitlesStyles';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import { StyledProjectIcon, StyledFlagCircle, IconWrapper } from '../Icons/IconsStyles';
import { Budget, Budget2, BudgetLabel, CategoriesIconTitleContainer, IndividualContainer, TitleText } from '../Box/BoxStyles';
import GroupsIcon from '@mui/icons-material/Groups';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { Field, Form } from 'react-final-form';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import { validateProjectForm } from '../Edit/EditValidator'; 
import { Box, Container, IconButton, Tooltip, Zoom } from '@mui/material';
import { SetupFormValues } from '../Edit/Type';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

interface TitleProps {
  project_name: string;
  code: string;
  overview: string;
  project_scope: string;
  project_goals_1: string;
  project_goals_2: string;
  exec_sponsor?: string;
  business_product?: string;
  process_owner?: string;
  pm?: string;
  dev?: string;
  risk?: string;
  budget_actual_usd?: number;
  budget_planned_usd?: number;
  edit?: boolean;
  add?: boolean;
}

function PaperComponent(props: any) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const DraggableDialog: React.FC<{ open: boolean; onClose: (confirmed: boolean) => void }> = ({ open, onClose }) => (
  <Dialog open={open} onClose={() => onClose(false)} PaperComponent={PaperComponent} aria-labelledby="draggable-dialog-title">
    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
      Confirm Submission
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to update the project details?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button autoFocus onClick={() => onClose(false)} color="primary">
        Cancel
      </Button>
      <Button onClick={() => onClose(true)} color="primary">
        Submit
      </Button>
    </DialogActions>
  </Dialog>
);

const Title: React.FC<TitleProps> = ({
  project_name,
  code,
  overview,
  project_scope,
  project_goals_1,
  project_goals_2,
  exec_sponsor,
  business_product,
  process_owner,
  pm,
  dev,
  risk,
  budget_actual_usd,
  budget_planned_usd,
  edit = false,
  add = false
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [formValues, setFormValues] = useState<Partial<SetupFormValues> | null>(null);

  const onSubmit = async (values: Partial<SetupFormValues>) => {
    setFormValues(values);
    setDialogOpen(true);
  };

  const handleDialogClose = async (confirmed: boolean) => {
    setDialogOpen(false);

    if (confirmed && formValues) {
      const validationErrors = await validateProjectForm(formValues);
      if (Object.keys(validationErrors).length > 0) {
        return validationErrors;
      }

      try {
        if (edit) {
          await axios.put('/projects', {
            projectName: project_name,
            updatedData: formValues
          });
          setSnackbarMessage('Project updated successfully!');
        } else if (add) {
          await axios.post('/projects', formValues);
          setSnackbarMessage('Project added successfully!');
        }
        setSnackbarOpen(true);
        setTimeout(() => window.location.reload(), 2000); // Reload the page after 2 seconds
      } catch (error) {
        setSnackbarMessage('Error saving project!');
        setSnackbarOpen(true);
        console.error('Error saving project:', error);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleGoBack = () => {
    window.location.reload(); // Reload the page to return to the original state
  };

  return (
    <Form
      initialValues={{
        project_name,
        code,
        overview,
        project_scope,
        project_goals_1,
        project_goals_2,
        exec_sponsor,
        business_product,
        process_owner,
        pm,
        dev,
        risk,
        budget_actual_usd,
        budget_planned_usd,
      }}
      validate={validateProjectForm}
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <CustomBox>
            {(edit || add) && (
              <Tooltip title="Go Back" TransitionComponent={Zoom} arrow>
                <IconButton
                  color="secondary"
                  sx={{ '&:hover svg': { transform: 'scale(1.2)' }, transition: 'transform 0.3s' }}
                  onClick={handleGoBack}
                >
                  <ArrowBackIcon sx={{ color: 'rgba(4, 36, 106, 1)' }} />
                </IconButton>
              </Tooltip>
            )}
            {(edit || add) ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field name="project_name">
                    {({ input, meta }: any) => (
                      <TextField
                        {...input}
                        label="Project Name"
                        variant="outlined"
                        fullWidth
                        error={meta.touched && Boolean(meta.error)}
                        helperText={meta.touched && meta.error}
                        InputLabelProps={{
                          required: true,
                          sx: { '& .MuiFormLabel-asterisk': { color: 'red' } }
                        }}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={6}>
                  <Field name="code">
                    {({ input, meta }: any) => (
                      <TextField
                        {...input}
                        label="Code"
                        variant="outlined"
                        fullWidth
                        error={meta.touched && Boolean(meta.error)}
                        helperText={meta.touched && meta.error}
                        InputLabelProps={{
                          required: true,
                          sx: { '& .MuiFormLabel-asterisk': { color: 'red' } }
                        }}
                      />
                    )}
                  </Field>
                </Grid>
              </Grid>
            ) : (
              <>
                <ProjectName>{project_name}</ProjectName>
                <Code>{code}</Code>
              </>
            )}
          </CustomBox>

          <OverviewBoxComponent>
            <OverviewTitle>Overview</OverviewTitle>
            {(edit || add) ? (
              <Grid item xs={12}>
                <Field name="overview">
                  {({ input, meta }: any) => (
                    <TextField
                      label="Overview"
                      {...input}
                      fullWidth
                      multiline
                      rows={4}
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                      InputLabelProps={{
                        required: true,
                        sx: { '& .MuiFormLabel-asterisk': { color: 'red' } }
                      }}
                    />
                  )}
                </Field>
              </Grid>
            ) : (
              <OverviewGrid overview={overview} />
            )}
          </OverviewBoxComponent>

          <ProjectScopeBoxComponent>
            <StyledProjectDiv>
              <StyledTitleIconDiv>
                <ProjectScopeTitle>Project Scope</ProjectScopeTitle>
                <StyledProjectIcon>
                  <AssessmentIcon />
                </StyledProjectIcon>
              </StyledTitleIconDiv>
              {(edit || add) ? (
                <Field name="project_scope">
                  {({ input, meta }: any) => (
                    <TextField
                      {...input}
                      label="Project Scope"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                      InputLabelProps={{
                        required: true,
                        sx: { '& .MuiFormLabel-asterisk': { color: 'red' } }
                      }}
                    />
                  )}
                </Field>
              ) : (
                <OverviewGrid overview={project_scope} />
              )}
            </StyledProjectDiv>

            <Separator />

            <StyledProjectDiv>
              <StyledTitleIconDiv>
                <ProjectScopeTitle>Project Goals</ProjectScopeTitle>
                <StyledFlagCircle>
                  <FlagCircleIcon />
                </StyledFlagCircle>
              </StyledTitleIconDiv>
              {(edit || add) ? (
                <>
                  <Field name="project_goals_1">
                    {({ input, meta }: any) => (
                      <TextField
                        {...input}
                        label="Project Goals 1"
                        variant="outlined"
                        fullWidth
                        multiline
                        error={meta.touched && Boolean(meta.error)}
                        helperText={meta.touched && meta.error}
                        InputLabelProps={{
                          required: true,
                          sx: { '& .MuiFormLabel-asterisk': { color: 'red' } }
                        }}
                      />
                    )}
                  </Field>
                  <Field name="project_goals_2">
                    {({ input, meta }: any) => (
                      <TextField
                        {...input}
                        label="Project Goals 2"
                        variant="outlined"
                        fullWidth
                        multiline
                        error={meta.touched && Boolean(meta.error)}
                        helperText={meta.touched && meta.error}
                        InputLabelProps={{
                          required: true,
                          sx: { '& .MuiFormLabel-asterisk': { color: 'red' } }
                        }}
                      />
                    )}
                  </Field>
                </>
              ) : (
                <>
                  <OverviewGrid overview={project_goals_1} />
                  <OverviewGrid overview={project_goals_2} />
                </>
              )}
            </StyledProjectDiv>
          </ProjectScopeBoxComponent>

          <CategoriesBoxComponent>
            <Grid item xs={6}>
              <Item>
                <IndividualContainer>
                  <IconWrapper>
                    <GroupsIcon />
                  </IconWrapper>
                  <CategoriesIconTitleContainer>
                    <TitleText>Business Team</TitleText>
                  </CategoriesIconTitleContainer>
                  {(edit || add) ? (
                    <>
                      <Field name="exec_sponsor">
                        {({ input, meta }: any) => (
                          <TextField
                            {...input}
                            label="Executive Sponsor"
                            variant="outlined"
                            fullWidth
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                            InputLabelProps={{
                              required: true,
                              sx: { '& .MuiFormLabel-asterisk': { color: 'red' } }
                            }}
                          />
                        )}
                      </Field>
                      <Field name="business_product">
                        {({ input, meta }: any) => (
                          <TextField
                            {...input}
                            label="Business Product"
                            variant="outlined"
                            fullWidth
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                            InputLabelProps={{
                              required: true,
                              sx: { '& .MuiFormLabel-asterisk': { color: 'red' } }
                            }}
                          />
                        )}
                      </Field>
                      <Field name="process_owner">
                        {({ input, meta }: any) => (
                          <TextField
                            {...input}
                            label="Process Owner"
                            variant="outlined"
                            fullWidth
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                            InputLabelProps={{
                              required: true,
                              sx: { '& .MuiFormLabel-asterisk': { color: 'red' } }
                            }}
                          />
                        )}
                      </Field>
                    </>
                  ) : (
                    <StyledUl>
                      <li>Exec, Sponsor: {exec_sponsor}</li>
                      <li>Business Product: {business_product}</li>
                      <li>Process Owner: {process_owner}</li>
                    </StyledUl>
                  )}
                </IndividualContainer>
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <IndividualContainer>
                  <IconWrapper>
                    <GroupsIcon />
                  </IconWrapper>
                  <CategoriesIconTitleContainer>
                    <TitleText>HUB Team</TitleText>
                  </CategoriesIconTitleContainer>
                  {(edit || add) ? (
                    <>
                      <Field name="pm">
                        {({ input, meta }: any) => (
                          <TextField
                            {...input}
                            label="Project Manager"
                            variant="outlined"
                            fullWidth
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                            InputLabelProps={{
                              required: true,
                              sx: { '& .MuiFormLabel-asterisk': { color: 'red' } }
                            }}
                          />
                        )}
                      </Field>
                      <Field name="dev">
                        {({ input, meta }: any) => (
                          <TextField
                            {...input}
                            label="Developer"
                            variant="outlined"
                            fullWidth
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                            InputLabelProps={{
                              required: true,
                              sx: { '& .MuiFormLabel-asterisk': { color: 'red' } }
                            }}
                          />
                        )}
                      </Field>
                    </>
                  ) : (
                    <StyledUl>
                      <li>PM: {pm}</li>
                      <li>Dev: {dev}</li>
                    </StyledUl>
                  )}
                </IndividualContainer>
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <IndividualContainer>
                  <IconWrapper>
                    <ContentPasteSearchIcon />
                  </IconWrapper>
                  <CategoriesIconTitleContainer>
                    <TitleText>Risk & Issues</TitleText>
                  </CategoriesIconTitleContainer>
                  {(edit || add) ? (
                    <Field name="risk">
                      {({ input, meta }: any) => (
                        <TextField
                          {...input}
                          label="Risk"
                          variant="outlined"
                          fullWidth
                          multiline
                          rows={4}
                          error={meta.touched && Boolean(meta.error)}
                          helperText={meta.touched && meta.error}
                          InputLabelProps={{
                            required: true,
                            sx: { '& .MuiFormLabel-asterisk': { color: 'red' } }
                          }}
                        />
                      )}
                    </Field>
                  ) : (
                    <StyledUl>{risk}</StyledUl>
                  )}
                </IndividualContainer>
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <IndividualContainer>
                  <IconWrapper>
                    <CurrencyExchangeIcon />
                  </IconWrapper>
                  <CategoriesIconTitleContainer>
                    <TitleText>HUB Project Budget</TitleText>
                  </CategoriesIconTitleContainer>
                  {(edit || add) ? (
                    <>
                      <Field name="budget_actual_usd">
                        {({ input, meta }: any) => (
                          <TextField
                            {...input}
                            label="Actual Budget (USD)"
                            variant="outlined"
                            type="number"
                            fullWidth
                            error={meta.touched && Boolean(meta.error)}    
                            helperText={meta.touched && meta.error}
                            InputLabelProps={{
                              required: true,
                              sx: { '& .MuiFormLabel-asterisk': { color: 'red' } }
                            }}
                          />
                        )}
                      </Field>
                      <Field name="budget_planned_usd">
                        {({ input, meta }: any) => (
                          <TextField
                            {...input}
                            label="Planned Budget (USD)"
                            variant="outlined"
                            type="number"
                            fullWidth
                            error={meta.touched && Boolean(meta.error)}
                            helperText={meta.touched && meta.error}
                            InputLabelProps={{
                              required: true,
                              sx: { '& .MuiFormLabel-asterisk': { color: 'red' } }
                            }}
                          />
                        )}
                      </Field>
                    </>
                  ) : (
                    <ul>
                      <Budget>
                        <BudgetLabel>Actual</BudgetLabel> 
                        <Budget2 isActual={true} budget_actual_usd={budget_actual_usd} budget_planned_usd={budget_planned_usd}>
                          {budget_actual_usd} USD
                        </Budget2>
                      </Budget>
                      <br />
                      <Budget>
                        <BudgetLabel>Planned</BudgetLabel> 
                        <Budget2 isActual={false} budget_actual_usd={budget_actual_usd} budget_planned_usd={budget_planned_usd}>
                          {budget_planned_usd} USD
                        </Budget2>
                      </Budget>
                    </ul>
                  )}
                </IndividualContainer>
              </Item>
            </Grid>
            <Button
              type="button"
              variant="contained"
              color="primary"
              sx={{ backgroundColor: 'rgba(4, 36, 106, 1)' }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </CategoriesBoxComponent>

          <DraggableDialog open={dialogOpen} onClose={handleDialogClose} />
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{
              '& .MuiSnackbarContent-root': {
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
              },
            }}
          >
            <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </form>
      )}
    />
  );
};

export default Title;
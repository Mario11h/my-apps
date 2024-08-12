import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store';
import { fetchProjects } from './features/projectsSlices';
import Pagination from './Components/Pagination';
import { styled } from '@mui/material/styles';
import { Box, Grid, CircularProgress, Tooltip, Zoom, IconButton, Button, Container, Typography } from '@mui/material';
import Title from './Components/Title/Titles';
import BasicTimeline from './Components/Milestones/Milestones';
import { useReactToPrint } from 'react-to-print';
import { MilestonesTitle, StatusLabel } from './Components/Title/TitlesStyles';
import { StyledFullWidthGrayBox } from './Components/Box/BoxStyles';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddchartIcon from '@mui/icons-material/Addchart';
import EditIcon from '@mui/icons-material/Edit';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import { images } from './Components/Assets/DummyData';
import { SetupFormValues } from './Components/Edit/Type';
import MultipleSelectCheckmarks from './Components/MultipleSelectCheckmarks';

const Item = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

interface Project {
  project_name: string;
  code: string;
  overview?: string;
  project_scope?: string;
  project_goals_1?: string;
  project_goals_2?: string;
  exec_sponsor?: string;
  business_product?: string;
  process_owner?: string;
  pm?: string;
  dev?: string;
  risk?: string;
  budget_actual_usd?: number;
  budget_planned_usd?: number;
  milestones0?: string;
  milestones1?: string;
  milestones2?: string;
  milestones3?: string;
  milestones4?: string;
  milestones5?: string;
  milestonesDates?: string[];
}

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading, error } = useSelector((state: RootState) => state.projects);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isAddMode, setIsAddMode] = useState<boolean>(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const fetchProjectsData = () => {
    dispatch(fetchProjects());
  };

  useEffect(() => {
    fetchProjectsData();
  }, [dispatch]);

  useEffect(() => {
    if (projects.length > 0) {
      setTotalPages(projects.length);
      setCurrentProject(projects[currentPage - 1] as Project | null);
    }
  }, [projects, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'All Project Details',
    onBeforePrint: () => {
      dispatch(fetchProjects());
    }
  });

  const handleDelete = async (projectName: string) => {
    try {
      await axios.delete('/projects', { data: { projectName } });
      console.log(`Deleted project with name ${projectName}`);
      fetchProjectsData();
    } catch (error) {
      console.error(`Error deleting project with name ${projectName}:`, error);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
    setIsAddMode(false);
  };

  const handleAddProjectClick = () => {
    setCurrentProject({
      project_name: '',
      code: '',
      overview: '',
      project_scope: '',
      project_goals_1: '',
      project_goals_2: '',
      exec_sponsor: '',
      business_product: '',
      process_owner: '',
      pm: '',
      dev: '',
      risk: '',
      budget_actual_usd: 0,
      budget_planned_usd: 0,
      milestones0: '',
      milestones1: '',
      milestones2: '',
      milestones3: '',
      milestones4: '',
      milestones5: '',
      milestonesDates: [],
    });
    setIsEditMode(false);
    setIsAddMode(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const getMilestones = (project: Project) => {
    const milestones = [
      project.milestones0 || '',
      project.milestones1 || '',
      project.milestones2 || '',
      project.milestones3 || '',
      project.milestones4 || '',
      project.milestones5 || '',
    ].flat();
    return milestones;
  };

  return (
    <Router>
      <Box sx={{ padding: 2 }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 10,
                    width: '10%',
                    height: '10vh',
                    backgroundImage: `url(${images[0].imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
                  <Tooltip title="Add Project" TransitionComponent={Zoom} arrow>
                    <IconButton
                      color="primary"
                      onClick={handleAddProjectClick}
                      size="large"
                       sx={{ '&:hover svg': { transform: 'scale(1.2)' }, transition: 'transform 0.3s',color: 'rgba(4, 36, 106, 1)' }}
                    >
                      <AddchartIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Project" TransitionComponent={Zoom} arrow>
                    <IconButton
                      color="primary"
                      onClick={handleEditClick}
                      size="large"
                      sx={{ '&:hover svg': { transform: 'scale(1.2)' }, transition: 'transform 0.3s',color: 'rgba(4, 36, 106, 1)' }}
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download PDF" TransitionComponent={Zoom} arrow>
                    <IconButton
                      color="primary"
                      onClick={handlePrint}
                      size="large"
                      sx={{ '&:hover svg': { transform: 'scale(1.2)' }, transition: 'transform 0.3s',color: 'rgba(4, 36, 106, 1)' }}
                    >
                      <PictureAsPdfIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  <MultipleSelectCheckmarks handleDelete={handleDelete}  />
                </Box>

                <Box ref={componentRef}>
                  {currentProject ? (
                    <>
                      <Grid container spacing={2}>
                        <Grid item xs={8}>
                          <Title
                            project_name={currentProject.project_name || ''}
                            code={currentProject.code || ''}
                            overview={currentProject.overview || ''}
                            project_scope={currentProject.project_scope || ''}
                            project_goals_1={currentProject.project_goals_1 || ''}
                            project_goals_2={currentProject.project_goals_2 || ''}
                            exec_sponsor={currentProject.exec_sponsor || ''}
                            business_product={currentProject.business_product || ''}
                            process_owner={currentProject.process_owner || ''}
                            pm={currentProject.pm || ''}
                            dev={currentProject.dev || ''}
                            risk={currentProject.risk || ''}
                            budget_actual_usd={currentProject.budget_actual_usd || 0}
                            budget_planned_usd={currentProject.budget_planned_usd || 0}
                            edit={isEditMode}
                            add={isAddMode}
                          />
                        </Grid>

                        <Grid item xs={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                          <Item sx={{ flex: 1 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <StatusLabel isFinished={!!currentProject?.milestones5?.length}>
                                  {!!currentProject?.milestones5?.length ? 'FINISHED' : 'ONGOING'}
                                </StatusLabel>
                              </div>
                              <StyledFullWidthGrayBox>
                                <MilestonesTitle>MILESTONES</MilestonesTitle>
                                <BasicTimeline 
                                  milestones={getMilestones(currentProject ?? {} as Project)} 
                                  isFinished={!!currentProject?.milestones5?.length}
                                  currentProject={currentProject}
                                  isEditMode={isEditMode}
                                />
                              </StyledFullWidthGrayBox>
                            </div>
                          </Item>
                        </Grid>
                      </Grid>

                      {(isEditMode || isAddMode) && (
                        <Box sx={{ marginTop: 2 }}>
                          {/* <Button type="submit" variant="contained" color="primary" sx={{ backgroundColor: 'rgba(4, 36, 106, 1)' }}>
                            {isEditMode ? 'Update Project' : 'Add Project'}
                          </Button> */}
                        </Box>
                      )}
                    </>
                  ) : (
                    <Typography variant="h6">No project selected</Typography>
                  )}
                </Box>

                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange}
                  projectName={currentProject?.project_name} // Pass the project name to Pagination
                />
              </>
            }
          />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;